import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { generateTokens, getEnvVariable, TokenPayload } from "../Controllers/auth.controller";


export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    try {
        /**
         * STEP 1: Try verifying access token
         */
        if (accessToken) {
            const decoded = jwt.verify(
                accessToken,
                getEnvVariable("JWT_ACCESS_SECRET")
            ) as TokenPayload;

            req.user = {
                id: decoded.id,
                email: decoded.email,
            };

            return next();
        }
    } catch (error) {
        /**
         * STEP 2: Access token expired → try refresh
         */
        if (!(error instanceof TokenExpiredError)) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }
    }

    /**
     * STEP 3: Verify refresh token
     */
    try {
        const decodedRefresh = jwt.verify(
            refreshToken,
            getEnvVariable("JWT_REFRESH_SECRET")
        ) as TokenPayload;

        /**
         * STEP 4: Generate new access token
         */
        const newAccessToken = generateTokens(
            decodedRefresh.id,
            decodedRefresh.email
        ).accessToken;

        /**
         * STEP 5: Set new access token cookie
         */
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        req.user = {
            id: decodedRefresh.id,
            email: decodedRefresh.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired, please login again",
        });
    }
};
