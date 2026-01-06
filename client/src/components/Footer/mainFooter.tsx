import React from 'react'


const aboutSection = [
    {
        name: "About us",
        link: "/about"
    }, {
        name: "Contact",
        link: "/contact"
    }, {
        name: "Pricing",
        link: "/pricing"
    }, {
        name: "Blog",
        link: "/blog"
    }, {
        name: "Help",
        link: "/help"
    }, {
        name: "Features",
        link: "/features"
    }
]


const priceSection = [
    {
        name: "Sell",
        link: "/sell"
    }, {
        name: "Terms & Conditions",
        link: "/terms"
    }, {
        name: "Privacy Policy",
        link: "/privacy"
    }, {
        name: "Earn Money",
        link: "/earn"
    }, {
        name: "FAQ",
        link: "/faq"
    }, {
        name: "Refund Policy",
        link: "/refund"
    }
]
const MainFooter = () => {
    return (
        <div className='w-full border-t border-pink-800 shadow-xl shadow-amber-50 gap-40 px-10 flex bg-pink-700 h-full py-7'>
            <div>
                <p className='font-semibold text-lg text-neutral-900 mb-2'>About</p>
                {
                    aboutSection.map((item, index) => {
                        return (
                            <div key={index} className='cursor-pointer'>
                                <p className='text-black text-md hover:underline'>{item.name}</p>
                            </div>
                        )
                    })
                }
            </div>

            <div className=''>
                <p className='text-lg mb-2 font-semibold '>Sell on LearnForge</p>
                {
                    priceSection.map((item, index) => {
                        return (
                            <div key={index} className='cursor-pointer'>
                                <p className='text-black text-md hover:underline'>{item.name}</p>
                            </div>
                        )
                    })
                }

            </div>

        </div>
    )
}

export default MainFooter
