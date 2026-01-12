"use client";

import z from "zod";
import { useState, useEffect } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "../ui/input-otp";
import { useSignup } from "@/hooks/useAuth.state";

const SignupOTPPopup = ({
    setSelected,
    name,
    email,
}: {
    setSelected: (value: string) => void;
    name: string;
    email: string;
}) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);

    const { mutate, isPending } = useSignup();

    const validSchema = z.object({
        email: z.string().email("Email is not valid"),
        name: z.string().min(3).max(30),
        otp: z.string().length(6, "OTP must be exactly 6 digits"),
    });

    const handelSubmit = async () => {

        console.log(otp)
        const result = validSchema.safeParse({ email, name, otp });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError("");

        mutate(
            { email, otp, name },
            {
                onError: (err: any) => {
                    setError(err?.message || "Invalid OTP");
                },
            }
        );
    };

    const resentOTP = () => {
        if (timer > 0) return;

        setTimer(30);

        // 👉 call resend OTP API here (NOT signup)
        // resendOtpMutation.mutate({ email });

    };

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (error) setError("");
    }, [otp]);

    return (
        <div className='w-1/2 mb-2 justify-center item-center p-4'>
            <div className='w-full mt-15 px-7 py-10 gap-5 flex-row '>
                <p className='text-4xl ml-6 font-semibold'>
                    On The Way To Become Master
                </p>

                <div className="ml-20">
                    <p className='text-lg mt-10 ml-1'>Enter your OTP</p>

                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
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
                        onClick={resentOTP}
                    >
                        <p>{timer > 0 ? `Resend in ${timer}s` : "Reset OTP"}</p>
                    </div>
                </div>

                <button
                    className='rounded-sm bg-pink-700 w-90 ml-20 mt-10 cursor-pointer item-center justify-center px-10 py-3'
                    onClick={handelSubmit}
                    disabled={isPending}
                >
                    <p className='text-black text-lg font-semibold'>
                        {isPending ? "Loading..." : "Submit"}
                    </p>
                </button>

                <div className='flex gap-1 ml-36 mt-5'>
                    <p className='text-neutral-600'>Don't have an account?</p>
                    <button
                        className='text-pink-700 hover:underline cursor-pointer'
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
