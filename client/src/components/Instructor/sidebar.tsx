import React from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { IoStatsChart } from 'react-icons/io5'

const option = [
    {
        name: "Dashboard",
        icon: <IoStatsChart className='size-6' />

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
        icon: <BsCurrencyDollar className='size-6' />
    }, {
        name: "Discounts",
        icon: <IoStatsChart className='size-6' />
    }
]

const Sidebar = () => {
    return (
        <div className='w-70   overflow-x-hidden h-screen border-r border-neutral-700  text-white bg-black'>
            <p className='text-3xl ml-5 mt-5 font-semibold'>LearnForge</p>
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

            <div className='mt-45'>
                <div className='flex py-4 px-4  gap-3 border-t cursor-pointer border-neutral-700'>
                    <IoStatsChart className='size-6' />
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
