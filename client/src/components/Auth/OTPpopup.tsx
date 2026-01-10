"use client"
import { useState } from "react";

const OTPPopup = ({ setSelected }: { setSelected: (value: string) => void }) => {

    const handelSubmit = async () => {

    }


    const resetOTP = async () => {
        setTimer(0);
        setTimeout(() => {
            setTimer(timer+1);
        })
        handelSubmit()
    }






    const [email, setEmail] = useState<string>("")
    const [error, setError] = useState<string>("");
    const [timer,setTimer] = useState(0);
    return (
        <div className='w-1/2 mb-2 justify-center item-center p-4'>
            <div className='w-full mt-15 px-7 py-10 gap-5 flex-row '>
                <p className='text-4xl ml-6  font-semibold' style={{ fontFamily: "-apple-system" }}>On The Way To Become Master</p>
                <p className='text-lg mt-10 ml-1  '>Enter your OTP</p>
                <div className='border mt-1 border-pink-700 rounded-md px-3 cursor-pointer py-3 w-130'>
                    <input type="text"
                        placeholder='johndoe@gmail.com'
                        style={{ fontFamily: "apple-system" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='outline-none w-full text-md text-black text-lg '
                    />
                </div>

                <div className="ml-110 cursor-pointer hover:text-black text-sm mt-2">
                    <p>Reset OTP</p>
                </div>


                <button className='rounded-sm bg-pink-700 w-130 mt-15 cursor-pointer item-center justify-center px-10 py-3'>
                    <p className='text-black text-lg font-semibold'>Login</p>
                </button>


                <div className='flex gap-1 ml-36 mt-5'>
                    <p className='text-neutral-600'>Don't have an account?</p>
                    <button className='text-pink-700 hover:underline cursor-pointer'
                        onClick={() => {
                            setSelected("Signup")
                        }}
                    >Signup</button>
                </div>
            </div>
        </div>
    )
}

export default OTPPopup
