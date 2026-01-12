"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "../ui/input-otp";

import { validSignupSchemaSchema } from "@/Constants/Schemas/authSchema";
import { useSignup } from "@/hooks/useAuth.state";
import { useAppDispatch } from "@/Store/hooks";
import { setAuth } from "@/Store/slices/auth.slice";

interface SignupOTPPopupProps {
    setSelected: (value: string) => void;
    name: string;
    email: string;
}

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

const SignupOTPPopup = ({
    setSelected,
    name = "Chandan",
    email = "Chandan@gmail.com",
}: SignupOTPPopupProps) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);

    const { mutate: signup, isPending } = useSignup();
    const dispatch = useAppDispatch();
    const router = useRouter();

    /* -------------------- SUBMIT HANDLER (FIXED) -------------------- */
    const handleSubmit = useCallback(
        (otpValue?: string) => {
            const finalOtp = otpValue ?? otp;
            const result = validSignupSchemaSchema.safeParse({
                email,
                name,
                otp: finalOtp,
            });

            if (!result.success) {
                setError(result.error.issues[0]?.message ?? "Invalid input");
                return;
            }

            setError(null);

            signup(
                { email, otp: finalOtp, name },
                {
                    onSuccess: (data) => {
                        dispatch(setAuth(data.data));
                        router.replace("/");
                    },
                    onError: (err: any) => {
                        setError(err?.message || "Invalid or expired OTP");
                    },
                }
            );
        },
        [email, name, otp, signup, dispatch, router]
    );

    /* -------------------- RESEND OTP -------------------- */
    const handleResendOTP = useCallback(() => {
        if (timer > 0 || isPending) return;

        setTimer(RESEND_TIME);

        // IMPORTANT:
        // Call ONLY resend OTP API here (not verify/signup)
    }, [timer, isPending]);

    /* -------------------- TIMER LOGIC -------------------- */
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    /* -------------------- CLEAR ERROR ON OTP CHANGE -------------------- */
    useEffect(() => {
        if (error) setError(null);
    }, [otp]);

    /* -------------------- OPTIONAL AUTO SUBMIT (SAFE) -------------------- */
    useEffect(() => {
        if (otp.length === OTP_LENGTH) {
            handleSubmit(otp); // ✅ pass value explicitly (NO race condition)
        }
    }, [otp, handleSubmit]);

    return (
        <div className="w-1/2 mb-2 justify-center item-center p-4">
            <div className="w-full mt-15 px-7 py-10 gap-5 flex-row ">
                <p className="text-4xl ml-6 font-semibold">
                    On The Way To Become Master
                </p>

                <div className="ml-20">
                    <p className="text-lg mt-10 ml-1">Enter your OTP</p>

                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isPending}
                    >
                        <InputOTPGroup className="border border-pink-800 rounded-md mt-4">
                            <InputOTPSlot index={0} className="size-15 border-r-pink-900 px-2 text-2xl" />
                            <InputOTPSlot index={1} className="size-15 border-r-pink-900 px-2 text-2xl" />
                            <InputOTPSlot index={2} className="size-15 border-r-pink-900 px-2 text-2xl" />
                            <InputOTPSlot index={3} className="size-15 border-r-pink-900 px-2 text-2xl" />
                            <InputOTPSlot index={4} className="size-15 border-r-pink-900 px-2 text-2xl" />
                            <InputOTPSlot index={5} className="size-15 border-r-pink-900 px-2 text-2xl" />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && (
                        <p className="text-red-500 text-sm ml-1 mt-2">{error}</p>
                    )}

                    <div
                        className="ml-74 cursor-pointer hover:text-black text-xs mt-2"
                        onClick={handleResendOTP}
                    >
                        <p>{timer > 0 ? `Resend in ${timer}s` : "Reset OTP"}</p>
                    </div>
                </div>

                <button
                    className="rounded-sm bg-pink-700 w-90 ml-20 mt-10 cursor-pointer item-center justify-center px-10 py-3"
                    onClick={() => handleSubmit()}
                    disabled={isPending || otp.length !== OTP_LENGTH}
                >
                    <p className="text-black text-lg font-semibold">
                        {isPending ? "Loading..." : "Submit"}
                    </p>
                </button>

                <div className="flex gap-1 ml-36 mt-5">
                    <p className="text-neutral-600">Don't have an account?</p>
                    <button
                        className="text-pink-700 hover:underline cursor-pointer"
                        onClick={() => setSelected("Signup")}
                    >
                        Signup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupOTPPopup;
