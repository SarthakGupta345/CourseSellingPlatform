import React from 'react'
import { BsBank2, BsCurrencyDollar } from 'react-icons/bs'
import { IoMdSettings } from 'react-icons/io'
import { IoSettings, IoStatsChart } from 'react-icons/io5'
import { MdMenuBook } from 'react-icons/md'
import { RiHomeSmile2Fill } from 'react-icons/ri'
import { TbRosetteDiscount } from 'react-icons/tb'

const option = [
    {
        name: "Dashboard",
        icon: <RiHomeSmile2Fill className='size-6' />

    },
    {
        name: "Courses",
        icon: <IoStatsChart className='size-6' />

    },
    {
        name: "Analytics",
        icon: <IoStatsChart className='size-6' />
    },
    {
        name: "Sales",
        icon: <BsCurrencyDollar className='size-6' />
    }, {
        name: "Payouts",
        icon: <BsBank2 className='size-6' />
    }, {
        name: "Discounts",
        icon: <TbRosetteDiscount className='size-6' />
    }
]

const Sidebar = () => {
    return (
        <div className='w-70   overflow-x-hidden h-screen border-r border-neutral-700  text-white bg-black'>
            <div className='flex ml-4 mt-5 gap-2 cursor-pointer'>
                <MdMenuBook className='size-9' />
                <p className='text-3xl  font-semibold'>LearnForge</p>
            </div>
            <div className='mt-10'>

                {
                    option.map((item, index) => {
                        return (
                            <div key={index} className='flex py-4 px-4  gap-3 border-b cursor-pointer border-neutral-700'>
                                {item.icon}
                                <p className='text-lg'>{item.name}</p>
                            </div>
                        )
                    })
                }


            </div>

            <div className='mt-40'>
                <div className='flex py-4 px-4  gap-3 border-t cursor-pointer border-neutral-700'>
                    <IoMdSettings className='size-6' />
                    <p className='text-lg'>Settings</p>
                </div>

                <div className='flex py-4 px-4  gap-3 border-t border-b mb-1 cursor-pointer border-neutral-700'>
                    <IoStatsChart className='size-6' />
                    <p className='text-lg'>Logout</p>
                </div>

            </div>

        </div>
    )
}

export default Sidebar
