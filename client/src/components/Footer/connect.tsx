import { link } from 'fs'
import React from 'react'
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const externalLinks = [
    {
        name: "Github",
        link: "https://github.com/learnforge",
        icon: <FaGithub />

    }, {
        name: "Linkedin",
        link: "https://www.linkedin.com/in/learnforge/",
        icon: <FaLinkedin className='size-10' />
    }, {
        name: "Twitter",
        link: "https://twitter.com/learnforge",
        icon: <FaLinkedin className=' size-10' />
    }, {
        name: "Facebook",
        link: "https://www.facebook.com/learnforge",
        icon: <FaYoutube className='text-black size-10' />
    }, {
        name: "Instagram",
        link: "https://www.ins",
        icon: <FaInstagram className='size-10 ' />
    }, {
        name: "Youtube",
        link: "https://www.youtube.com/learnforge",
        icon: <FaLinkedin />
    }
]

const ConnectFooter = () => {
    return (
        <div className='w-full flex h-full bg-pink-700 px-10 py-4'>
            <div className='flex gap-2'>
                <p>LearnForge</p>
                <p>& company &copy;</p>
            </div>

            <div className='flex gap-15 ml-auto mr-5 mb-5'>
                {
                    externalLinks.map((link) => {
                        return (
                            <div className='flex gap-2 cursor-pointer'
                                key={link.name}
                            >
                                <p className='mt-1 '>{link.icon}</p>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default ConnectFooter
