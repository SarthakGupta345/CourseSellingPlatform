"use client"
import { Upload } from 'lucide-react'
import React, { useState } from 'react'

const General = () => {
    const [thumbnail, setThumbnail] = useState<string>("")
    return (
        <div className='px-15 pr-100 mt-10'>

            {/* Thumbnail */}

            <div className='rounded-sm border flex border-neutral-300 h-33 item-center justify-center '>
                <div className='my-auto cursor-pointer'>
                    <Upload className='ml-13' />
                    <p className='mt-1'>Upload Thumbnail</p>
                </div>

            </div>

            <div className='flex mt-5 flex-col gap-2'>
                <p className='text-lg font-semibold ml-1 '>Name</p>
                <div className='px-4 py-3 rounded-sm border border-neutral-400 '>
                    <input type="text"
                        placeholder='Name of the Product'
                        className='outline-none text-md w-full'

                    />
                </div>
            </div>

            <div className='flex flex-col gap-2 mt-5'>
                <p className='text-lg font-semibold ml-1 '>Subtittle</p>
                <div className='px-4 py-3 rounded-sm border border-neutral-400 '>
                    <input type="text"
                        placeholder='Name of the Product'
                        className='outline-none text-md w-full'

                    />
                </div>
            </div>


            <div className='flex flex-col gap-2 mt-5'>
                <p className='text-lg font-semibold ml-1 '>Description</p>
                <div className='px-4 py-3 rounded-sm border border-neutral-400 '>
                    <input type="text"
                        placeholder='Name of the Product'
                        className='outline-none text-md w-full'

                    />
                </div>
            </div>


            <div className='flex flex-col gap-2 mt-5'>
                <p className='text-lg font-semibold ml-1 '>Category</p>
                <div className='px-4 py-3 rounded-sm border border-neutral-400 '>
                    <input type="text"
                        placeholder='Name of the Product'
                        className='outline-none text-md w-full'

                    />
                </div>
            </div>

            {/* Additional Details */}

            <div className='bg-pink-800 flex cursor-pointer mt-10 rounded-sm items-center py-3'>
                <p className='text-lg text-white item-center mx-auto '>Add Extra Details</p>

            </div>

        </div>
    )
}

export default General
