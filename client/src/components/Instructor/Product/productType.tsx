"use client"
import { Upload } from 'lucide-react'
import React, { useState } from 'react'

const ProductTypes = () => {
    const [selected, setSelected] = useState<string>("General")
    return (
        <div className='w-full h-full py-10  '>
            {/* topbar */}

            <div className='border-b px-15 flex flex-row gap-5  border-neutral-400  w-full'>
                <div className='item-center flex flex-col gap-1 cursor-pointer'
                    onClick={() => {
                        setSelected("General")
                    }}
                >
                    <p className='text-xl font-semibold ml-3.5 '>General</p>
                    <div className={selected == 'General' ?
                        'h-1 bg-black rounded-sm  w-25' :
                        'h-1 bg-white rounded-sm  w-25'
                    }>

                    </div>
                </div>


                <div className='item-center justify-center flex flex-col gap-1 cursor-pointer'
                    onClick={() => {
                        setSelected("File")
                    }}
                >
                    <p className='text-xl font-semibold ml-3.5 '>File</p>
                    <div className={selected == 'File' ?
                        'h-1 bg-black rounded-sm  w-15' :
                        'h-1 bg-white rounded-sm  w-15'
                    }>

                    </div>
                </div>



                <div className='item-center flex flex-col gap-1 cursor-pointer'
                    onClick={() => {
                        setSelected("Price")
                    }}
                >
                    <p className='text-xl font-semibold ml-3.5 '>Price</p>
                    <div className={selected == 'Price' ?
                        'h-1 bg-black rounded-sm  w-19' :
                        'h-1 bg-white rounded-sm  w-19'
                    }>

                    </div>
                </div>

                <div className='py-1  -mt-3 ml-auto mr-10 cursor-pointer mb-2 px-5 bg-pink-800 rounded-full'>
                    <p className='text-lg font-semibold mt-0.5 text-white'>Create</p>

                </div>
            </div>


            {/* MainBody */}

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

        </div>
    )
}

export default ProductTypes
