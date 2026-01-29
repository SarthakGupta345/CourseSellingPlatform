"use client"
import { Slice, Upload } from 'lucide-react'
import React, { useState } from 'react'
import General from './Docs/General'
import Price from './Docs/Price'
import File from './Docs/File'

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

            {
                selected == "General" && <General />
            }
            {
                selected == "File" && <File />
            }

            {
                selected == "Price" && <Price />
            }


        </div>
    )
}

export default ProductTypes
