"use client"
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
        name: "Product",
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

interface Props {
    setSelected: (value: boolean) => void
}

const Sidebar = ({ setSelected }: Props) => {
    const router = useRouter();
    return (
        <div className='w-65 md:w-70   overflow-x-hidden h-screen border-r border-pink-700  text-white bg-pink-800'>

            <div className=' ml-4 m-8 cursor-pointer'>

                <div className='absolute top-1 right-45 cursor-pointer'
                    onClick={() => {
                        setSelected(false);
                    }}
                >
                    <X className='size-5 text-neutral-200' />
                </div>
                <div className='flex gap-5 mt-2'
                    onClick={() => {
                        router.replace('/Instructor')
                    }}
                >
                    <MdMenuBook className='size-9' />
                    <p className='text-3xl  font-semibold'>LearnForge</p>
                </div>
            </div>
            <div className='mt-5'>

                {
                    option.map((item, index) => {
                        return (
                            <div key={index} className='flex py-5 px-4  gap-3 border-b cursor-pointer border-neutral-400'>
                                {item.icon}
                                <p className='text-lg'>{item.name}</p>
                            </div>
                        )
                    })
                }


            </div>

            <div className='mt-46'>
                <div className='flex py-4 px-4  gap-3 border-t cursor-pointer border-neutral-400'>
                    <IoMdSettings className='size-6' />
                    <p className='text-lg'>Settings</p>
                </div>

                <div className='flex py-4 px-4  gap-3 border-t border-b mb-1 cursor-pointer border-neutral-400'>
                    <IoStatsChart className='size-6' />
                    <p className='text-lg'>Logout</p>
                </div>

            </div>

        </div>
    )
}

export default Sidebar
