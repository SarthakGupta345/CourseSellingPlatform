"use client"
import { X } from 'lucide-react'
import React, { useState } from 'react'

const PriceHeader = () => {

    const [selected, setSelected] = useState<boolean>(false)

    if (true) return null
    return (
        <div className='w-full h-13 bg-blue-200 flex justify-center p-3 head'>
            <div className='ap-3 flex  ml-auto  gap-3 '>
                <p>Purchase your First 5 courses for absolutely Free</p>
                <div className='w-px ml-2 mr-2 h-6 rounded-full bg-neutral-600'></div>
                <p>Get 10% off your first order</p>
            </div>
            <div className='ml-auto mr-6 hover:bg-blue-300 cursor-pointer rounded-full px-1 py-1'
                onClick={() => {
                    setSelected(true)
                }}
            >
                <X className='size-5' />
            </div>
        </div>
    )
}

export default PriceHeader
