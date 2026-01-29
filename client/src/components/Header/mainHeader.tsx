"use client"
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const options = [
    {
        name: "Pricing",
        link: "/pricing"
    }, {
        name: "About",
        link: "/about"
    },
    {
        name: "Dashboard",
        link: "/dashboard"

    }, {
        name: "Discover",
        link: "/discover"
    }, {
        name: "Sell",
        link: "/Instructor"
    }
]
const MainHeader = () => {
    const router = useRouter()
    return (
        <div className='w-full h-20 bg-pink-700 border-b border-pink-800 shadow-xs shadow-pink-100 py-4 px-6 flex'>
            {/* Logo */}
            <div className='cursor-pointer'
                onClick={() => {
                    router.replace('/')
                }}
            >
                <p className='text-5xl font-semibold' style={{ fontFamily: "ui-rounded" }}>LearnForge</p>
            </div>

            {/* search */}

            <div className='flex bg-white rounded-full px-4 w-140 py-2  items-center gap-2 ml-10'>
                <Search className='size-5' />
                <input type="text"
                    className='outline-none text-black w-full text-md'
                    placeholder='Search courses'
                />
            </div>

            {/* profile */}
            <div className='flex  ml-auto'>

                {
                    options.map((option, index) => {
                        return (
                            <div
                                key={index}
                                onClick={()=>{
                                    router.push(option.link)
                                }}
                                className='border hover:border-white border-pink-700  cursor-pointer rounded-full bg-pink-700 px-6 py-2' text-white item-center justify-center>
                                <p className='text-white font-semibold mt-1'>{option.name}</p>
                            </div>
                        )
                    })
                }

                <button className='border border-pink-800 hover:border-white bg-black  cursor-pointer rounded-full ml-3  px-6 ' text-white item-center justify-center
                    onClick={() => {
                        router.push("/auth")
                    }}
                >
                    <p className='text-white font-semibold '>Login</p>
                </button>


            </div>

        </div>
    )
}

export default MainHeader
