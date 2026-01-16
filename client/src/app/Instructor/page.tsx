"use client"
import ProductPage from '@/components/Instructor/Product/page'
import Sidebar from '@/components/Instructor/sidebar'
import React, { useState } from 'react'

const InstructorPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    return (
        <div className='w-full h-full flex'>
            {
                sidebarOpen && <Sidebar setSelected={setSidebarOpen} />
            }
            <ProductPage />

        </div>
    )
}

export default InstructorPage
