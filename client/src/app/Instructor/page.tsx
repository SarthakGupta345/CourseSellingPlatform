"use client"
import SignupPage from '@/components/Instructor/auth/SignupPage'
import ProductPage from '@/components/Instructor/Product/page'
import Sidebar from '@/components/Instructor/sidebar'
import { useState } from 'react'
import photo from "../../assets/images/icon.png"
import Image from 'next/image'
const InstructorPage = () => {

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    return (
        <div className='w-full h-full flex'>
           
           
            <SignupPage />
        </div>
    )
}

export default InstructorPage
