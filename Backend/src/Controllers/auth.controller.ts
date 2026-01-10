import { Request, Response } from "express";
import { prisma } from "../Config/prisma";
import { authSchema, emailSchema, loginSchema, signupSchema } from "../Schema/auth.schema";
import redis from "../Config/reddis";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "../utils/response";
import crypto from "crypto";

// Constants
const OTP_EXPIRY = 300; // 5 minutes
const OTP_MAX_ATTEMPTS = 3;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const RATE_LIMIT_WINDOW = 3600; // 1 hour
const MAX_OTP_REQUESTS_PER_HOUR = 5;

// Types
interface TokenPayload {
    id: string;
    email: string;
}

// Utility Functions
const generateOtp = (): string => {
    const otp = crypto.randomInt(100000, 999999);
    return otp.toString();
};

const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const isRateLimited = async (email: string): Promise<boolean> => {
    const rateLimitKey = `rate-limit:${email}`;
    const count = await redis.incr(rateLimitKey);

    if (count === 1) {
        await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
    }

    return count > MAX_OTP_REQUESTS_PER_HOUR;
};

const setOtpWithAttempts = async (email: string, otp: string): Promise<void> => {
    const otpKey = `otp:${email}`;
    const attemptsKey = `otp-attempts:${email}`;

    await Promise.all([
        redis.set(otpKey, otp, "EX", OTP_EXPIRY),
        redis.set(attemptsKey, "0", "EX", OTP_EXPIRY),
    ]);
};

const cleanupOtpData = async (email: string): Promise<void> => {
    const otpKey = `otp:${email}`;
    const attemptsKey = `otp-attempts:${email}`;

    await Promise.all([
        redis.del(otpKey),
        redis.del(attemptsKey),
    ]);
};

const sendOtpEmail = async (email: string, otp: string, name?: string): Promise<void> => {
    // TODO: Implement actual email sending logic using a service like SendGrid, SES, etc.
    // For now, only log in development
    if (process.env.NODE_ENV === "development") {
        console.log(`OTP for ${email}:`, otp);
    }
    // In production, send actual email
    // await emailService.send({ to: email, subject: "Your OTP", otp, name });
};

// Controller Functions
export const generateSignupOTP = async (req: Request, res: Response): Promise<Response> => {
    try {
        const parsed = authSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendError(res, 400, "Invalid input", parsed.error.format());
        }

        const { email, name } = parsed.data;

        // Check rate limiting
        if (await isRateLimited(email)) {
            return sendError(res, 429, "Too many requests. Please try again later.");
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return sendError(res, 409, "User already exists");
        }

        const otpKey = `otp:${email}`;
        const attemptsKey = `otp-attempts:${email}`;

        // Check if OTP already exists
        const existingOtp = await redis.get(otpKey);
        if (existingOtp) {
            const attempts = Number((await redis.get(attemptsKey)) || 0);

            if (attempts >= OTP_MAX_ATTEMPTS) {
                return sendError(
                    res,
                    429,
                    "Too many OTP verification attempts. Please request a new OTP."
                );
            }

            const ttl = await redis.ttl(otpKey);
            return sendError(
                res,
                400,
                `OTP already sent. Please wait ${Math.ceil(ttl / 60)} minutes before requesting again.`
            );
        }

        const otp = generateOtp();
        await setOtpWithAttempts(email, otp);

        // Send OTP via email
        await sendOtpEmail(email, otp, name);

        return sendSuccess(res, 200, "OTP sent successfully", {
            expiresIn: OTP_EXPIRY,
        });
    } catch (error) {
        console.error("Error in generateSignupOTP:", error);
        return sendError(res, 500, "Failed to generate OTP. Please try again.");
    }
};

export const Signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendError(res, 400, "Invalid input", parsed.error.format());
        }

        const { email, name, otp } = parsed.data;

        // Verify OTP
        const otpKey = `otp:${email}`;
        const attemptsKey = `otp-attempts:${email}`;

        const storedOtp = await redis.get(otpKey);

        if (!storedOtp) {
            return sendError(res, 400, "OTP expired or not found");
        }

        if (storedOtp !== otp) {
            const attempts = await redis.incr(attemptsKey);

            if (attempts >= OTP_MAX_ATTEMPTS) {
                await cleanupOtpData(email);
                return sendError(
                    res,
                    400,
                    "Maximum OTP attempts exceeded. Please request a new OTP."
                );
            }

            return sendError(
                res,
                400,
                `Invalid OTP. ${OTP_MAX_ATTEMPTS - attempts} attempts remaining.`
            );
        }

        // Check if user was created between OTP generation and verification
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            await cleanupOtpData(email);
            return sendError(res, 409, "User already exists");
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                lastLoginAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        // Cleanup OTP data
        await cleanupOtpData(email);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.email);

        // Set cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return sendSuccess(res, 201, "Signup successful", {
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Error in Signup:", error);
        return sendError(res, 500, "Signup failed. Please try again.");
    }
};

export const generateLoginOTP = async (req: Request, res: Response): Promise<Response> => {
    try {
        const parsed = emailSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendError(res, 400, "Invalid email");
        }

        const { email } = parsed.data;

        // Check rate limiting
        if (await isRateLimited(email)) {
            return sendError(res, 429, "Too many requests. Please try again later.");
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            // Don't reveal if user exists for security
            return sendError(res, 404, "User not found");
        }

        const otpKey = `otp:${email}`;
        const attemptsKey = `otp-attempts:${email}`;

        // Check if OTP already exists
        const existingOtp = await redis.get(otpKey);
        if (existingOtp) {
            const attempts = Number((await redis.get(attemptsKey)) || 0);

            if (attempts >= OTP_MAX_ATTEMPTS) {
                return sendError(
                    res,
                    429,
                    "Too many OTP verification attempts. Please request a new OTP."
                );
            }

            const ttl = await redis.ttl(otpKey);
            return sendError(
                res,
                400,
                `OTP already sent. Please wait ${Math.ceil(ttl / 60)} minutes before requesting again.`
            );
        }

        const otp = generateOtp();
        await setOtpWithAttempts(email, otp);

        // Send OTP via email
        await sendOtpEmail(email, otp, user.name);

        return sendSuccess(res, 200, "OTP sent successfully", {
            expiresIn: OTP_EXPIRY,
        });
    } catch (error) {
        console.error("Error in generateLoginOTP:", error);
        return sendError(res, 500, "Failed to generate OTP. Please try again.");
    }
};

export const Login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendError(res, 400, "Invalid input", parsed.error.format());
        }

        const { email, otp } = parsed.data;

        const otpKey = `otp:${email}`;
        const attemptsKey = `otp-attempts:${email}`;

        const storedOtp = await redis.get(otpKey);

        if (!storedOtp) {
            return sendError(res, 400, "OTP expired or not found");
        }

        if (storedOtp !== otp) {
            const attempts = await redis.incr(attemptsKey);

            if (attempts >= OTP_MAX_ATTEMPTS) {
                await cleanupOtpData(email);
                return sendError(
                    res,
                    400,
                    "Maximum OTP attempts exceeded. Please request a new OTP."
                );
            }

            return sendError(
                res,
                400,
                `Invalid OTP. ${OTP_MAX_ATTEMPTS - attempts} attempts remaining.`
            );
        }

        const user = await prisma.user.update({
            where: { email },
            data: {
                lastLoginAt: new Date(),
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        await cleanupOtpData(email);

        const { accessToken, refreshToken } = generateTokens(user.id, user.email);

        // Set cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return sendSuccess(res, 200, "Login successful", {
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Error in Login:", error);
        return sendError(res, 500, "Login failed. Please try again.");
    }
};

const generateTokens = (id: string, email: string): { accessToken: string; refreshToken: string } => {
    const payload: TokenPayload = { id, email };

    const accessToken = jwt.sign(
        payload,
        getEnvVariable("JWT_ACCESS_SECRET"),
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        payload,
        getEnvVariable("JWT_REFRESH_SECRET"),
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
};

export const validateEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const parsed = emailSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendError(res, 400, "Invalid email");
        }

        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
            select: { id: true },
        });

        return sendSuccess(res, 200, "Email validated", {
            exists: Boolean(user),
        });
    } catch (error) {
        console.error("Error in validateEmail:", error);
        return sendError(res, 500, "Validation failed. Please try again.");
    }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return sendError(res, 401, "Refresh token not found");
        }

        const decoded = jwt.verify(
            refreshToken,
            getEnvVariable("JWT_REFRESH_SECRET")
        ) as TokenPayload;

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true },
        });

        if (!user) {
            return sendError(res, 401, "User not found");
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            getEnvVariable("JWT_ACCESS_SECRET"),
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        return sendSuccess(res, 200, "Token refreshed", { accessToken });
    } catch (error) {
        console.error("Error in refreshAccessToken:", error);
        return sendError(res, 401, "Invalid or expired refresh token");
    }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return sendSuccess(res, 200, "Logout successful");
    } catch (error) {
        console.error("Error in logout:", error);
        return sendError(res, 500, "Logout failed");
    }
};