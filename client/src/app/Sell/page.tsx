"use client"
import ProductTypes from '@/components/Instructor/Product/productType'
import Sidebar from '@/components/Instructor/sidebar'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

const page = () => {
    const [selected,setSelcted] = useState<boolean>(true)
    if(selected) return(
        <ProductTypes/>
    )
    return (
    <div className='w-full h-full flex '>
        <Sidebar/>
     <div className='w-full h-full'>
        {/* Topbar */}
       <div className='border-b px-10 flex gap-10 py-5  border-neutral-300'>
         <p className='text-2xl font-semibold '>Products</p>

          <div className='flex gap-4 item-center justify-center border-neutral-200 border rounded-full px-4 pr-20 py-2'>
             <Search className='size-6 mt-px text-neutral-400'/>
             <input type="text"
             placeholder='Search Product'
             className='outline-none text-md w-full'
             
             />
           </div>

         <div className='flex gap-5 ml-auto mr-5 '>
            <button className='px-5 py-1.5 bg-pink-800 rounded-md text-white cursor-pointer'
            onClick={()=>{
                setSelcted(true)
            }}
            >
                <p>New Product</p>
            </button>
         </div>

         <div></div>

       </div>
     </div>
      
    </div>
  )
}

export default page
