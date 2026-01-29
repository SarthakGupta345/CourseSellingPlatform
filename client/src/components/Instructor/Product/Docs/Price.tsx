"use client"
import  { useState } from 'react'

const Price = () => {
    const [price,setPrice] = useState<string>("0");
  return (
    <div className='w-full h-full flex px-15 py-10'>
        <div>
            <p className='text-lg ml-1 font-semibold'>Price</p>
            <div className='border-neutral-300 mt-1 flex gap-2  border px-4 pr-50 py-3 rounded-sm'>
                <p className='font-semibold'>$</p>
                <input type="number"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                placeholder='Enter Price'
                className='outline-none'
                
                />
            </div>

        </div>
      
    </div>
  )
}

export default Price
