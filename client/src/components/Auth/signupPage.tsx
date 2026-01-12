"use client";

import { useGenerateSignupOTP } from "@/hooks/useAuth.state";
import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import OTPPopup from "./OTPpopup";

type Errors = {
    name?: string;
    email?: string;
    general?: string;
};

const SignupPage = ({ setSelected }: { setSelected: (value: string) => void }) => {
    const [errors, setErrors] = useState<Errors>({});
    const [verified, setVerified] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const otpMutation = useGenerateSignupOTP();

    // ---------- Validation ----------
    const validationData = () => {
        const newErrors: Errors = {};
        const emailRegex = /^\S+@\S+\.\S+$/;

        if (name.length < 3 || name.length > 30) {
            newErrors.name = "Name must be between 3 and 30 characters";
        }

        if (!emailRegex.test(email)) {
            newErrors.email = "Invalid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---------- Submit ----------
    const handleSubmit = async () => {
        if (!validationData()) return;

        try {
            await otpMutation.mutateAsync({ name, email });
            setVerified(true);
        } catch (error: any) {
            console.log("error in signup", error);
            setErrors({
                general: error?.data?.message || error?.message || "Something went wrong",
            });
        }
    };

    // ---------- Clear field error on typing ----------
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (errors.name) {
            setErrors((prev) => ({ ...prev, name: undefined }));
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
        }
    };

    if (verified) return <OTPPopup setSelected={setSelected} name={name} email={email} />;

    return (
        <div className='w-1/2 justify-center item-center p-4'>
            <div className='w-full mt-10 px-16 py-5 gap-5 flex-row '>
                <p className='text-4xl ml-13 font-semibold'>Welcome to LearningForge</p>

                {/* NAME */}
                <p className='text-lg mt-10 ml-1'>Name</p>
                <div className='border mt-1 border-pink-700 rounded-md px-3 cursor-pointer py-3 w-130'>
                    <input
                        type="text"
                        placeholder='johndoe'
                        value={name}
                        onChange={handleNameChange}
                        className='outline-none w-full text-md text-black text-lg'
                    />
                </div>
                {errors.name && (
                    <p className="text-sm text-red-500 ml-1">{errors.name}</p>
                )}

                {/* EMAIL */}
                <p className='text-lg mt-2 ml-1'>Email</p>
                <div className='border mt-1 border-pink-700 rounded-md px-3 cursor-pointer py-3 w-130'>
                    <input
                        type="text"
                        placeholder='johndoe@gmail.com'
                        value={email}
                        onChange={handleEmailChange}
                        className='outline-none w-full text-md text-black text-lg'
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-500 ml-1">{errors.email}</p>
                )}

                {/* GENERAL ERROR */}
                {errors.general && (
                    <p className="text-sm text-red-500 ml-1 mt-2">{errors.general}</p>
                )}

                <button
                    className='rounded-sm bg-pink-700 w-130 mt-5 cursor-pointer item-center justify-center px-10 py-3'
                    onClick={handleSubmit}
                    disabled={otpMutation.isPending}
                >
                    <p className='text-black text-lg font-semibold'>
                        {otpMutation.isPending ? "Please wait..." : "Continue"}
                    </p>
                </button>

                {/* rest of your JSX untouched */}


                <div className='flex ml-7 gap-5 mt-5'>
                    <p className='text-neutral-300'>_________________________</p>
                    <p className='mt-1'>or login with</p>
                    <p className='text-neutral-300'>_________________________</p>

                </div>

                <div className='flex gap-3 ml-40 mt-6'>
                    <div className='rounded-sm hover:border-pink-800 p-2  cursor-pointer border '>
                        <FcGoogle className='size-8' />
                    </div>

                    <div className='rounded-sm hover:border-pink-800 py-1 px-2  cursor-pointer border '>
                        <FaLinkedin className='size-9 text-blue-800 mt-0.5 ' />
                    </div>

                    <div className='rounded-sm hover:border-pink-800 p-2  cursor-pointer border '>
                        <FaGithub className='size-8' />
                    </div>
                </div>

                <div className='flex gap-1 ml-36 mt-5'>
                    <p className='text-neutral-600'>Don't have an account?</p>
                    <button className='text-pink-700 hover:underline cursor-pointer'
                        onClick={() => {
                            setSelected("Login")
                        }}
                    >Login</button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
