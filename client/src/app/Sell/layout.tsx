import Sidebar from '@/components/Instructor/sidebar';
import React from 'react'

const SellsLayout = ({
    children
}: Readonly<{
    children: React.ReactNode;
}>
) => {
    return (
        <div className='w-full h-full flex'>
         <div>
               <Sidebar/>
         </div>
            {children}

        </div>
    )
}

export default SellsLayout
