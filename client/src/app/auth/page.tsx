"use client"
import React, { useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import icon from "../../assets/images/icon.png"
import Image from 'next/image'
import LoginPage from '@/components/Auth/loginPage'
import SignupPage from '@/components/Auth/signupPage'
import OTPPopup from '@/components/Auth/OTPpopup'
const AuthPage = () => {

    const [selected, setSelected] = useState<string>("Login")


    return (
        <div className='w-full h-full flex '>

            <div className='w-1/2 item-center justify-center py-5 px-20 h-full'>
                <Image src={icon} alt="icon" className='w-150 h-155 ' />

            </div>

            {/* {
                selected == "Login" ? (
                    <LoginPage setSelected={setSelected} />

                ) : (
                    <SignupPage setSelected={setSelected} />
                )

            } */}
            <OTPPopup/>


        </div>
    )
}

export default AuthPage
