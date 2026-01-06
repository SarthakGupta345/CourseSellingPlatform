"use client"
import { Settings } from "lucide-react";
import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignupPage = ({ setSelected }: { setSelected: (value: string) => void }) => {
    const [email, setEmail] = useState<string>("")
    const [name, setName] = useState<string>("")
    return (
        <div className='w-1/2 justify-center item-center p-4'>
            <div className='w-full mt-10 px-7 py-5 gap-5 flex-row '>
                <p className='text-4xl ml-30  font-semibold' style={{ fontFamily: "-apple-system" }}>Welcome Back</p>

                <p className='text-lg mt-10 ml-1  '> Name</p>
                <div className='border mt-1 border-pink-700 rounded-md px-3 cursor-pointer py-3 w-130'>
                    <input type="text"
                        placeholder='johndoe'
                        style={{ fontFamily: "apple-system" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='outline-none w-full text-md text-black text-lg '
                    />


                </div>

                <p className='text-lg mt-2 ml-1  '>Email</p>
                <div className='border mt-1 border-pink-700 rounded-md px-3 cursor-pointer py-3 w-130'>
                    <input type="text"
                        placeholder='johndoe@gmail.com'
                        style={{ fontFamily: "apple-system" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='outline-none w-full text-md text-black text-lg '
                    />

                </div>


                <button className='rounded-sm bg-pink-700 w-130 mt-5 cursor-pointer item-center justify-center px-10 py-3'>
                    <p className='text-black text-lg font-semibold'>Signup</p>
                </button>

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
                    <p className='text-neutral-600'>Already have an account?</p>
                    <button className='text-pink-700 hover:underline cursor-pointer'
                        onClick={() => {
                            setSelected("Login")
                        }}
                    >Login</button>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
