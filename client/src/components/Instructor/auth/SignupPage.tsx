"use client"
import { instructorSchema } from '@/Constants/Schemas/InstructorSchema'
import { LinkedinIcon, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { BsGithub, BsGoogle, BsLinkedin } from 'react-icons/bs'
import { RiLinkedinLine } from 'react-icons/ri'

interface Form {
    name: string,
    email: string

}

const SignupPage = () => {
    const [form, setForm] = useState<Form>({
        name: "",
        email: ""
    })


    const handleImage = async () => {

    }


    const handleSave = async () => {
        const parsed = instructorSchema.safeParse(form);
        if (!parsed.success) {
            console.log(parsed.data);
            return
        }

    }

    const [coverphotoSelected, setCoverPhotSelcted] = useState<boolean>(false);

    return (
        <div className='w-full h-full'>
            <div className='px-15 py-6 '>
                <p className='text-3xl font-semibold text-center'>Welcome to LearnForge</p>

                {/* Background photo */}

                <div className='border border-neutral-300 w-[95%] item-center justify-center mx-auto h-60  rounded-sm mt-10'
                    onClick={() => {
                        setCoverPhotSelcted(true)
                    }}
                >

                    <div className='mx-auto items-center justify-center flex flex-col align-middle mt-12 cursor-pointer'>
                        <Plus className='size-18 text-neutral-500 ' />
                        <p className='text-2xl font-sembold text-neutral-500'>Upload CoverPhoto</p>
                    </div>

                    <div className='rounded-full relative bg-red-500 size-40 items-baseline bottom-9'>
                        <div className='items-center justify-center flex flex-col '>
                            <Plus />
                        </div>

                    </div>

                </div>

                {/* Form Details */}


                <div className='flex mt-15 px-3  ml-8  h-full  border-neutral-400 rounded-md border'>


                    {/* Right half */}

                    <div className=' w-2/4 border-r px-3   flex  flex-col gap-1 py-10 border-neutral-300'>



                        <div className='px-1 py-1'>
                            <p className='text-lg font-semibold ml-1'>Name</p>
                            <div className='px-4 mt-1 py-4 w-[80%] rounded-sm border botrder-neutral-300'>
                                <input type="text"
                                    placeholder='Enter your Email'
                                    value={form.name}
                                    onChange={(e) => setForm(e.target.value)}
                                    className='outline-none text-md font-normal w-full'
                                />
                            </div>
                        </div>


                        <div className='px-1 '>
                            <p className='text-lg font-semibold ml-1'>Email</p>
                            <div className='px-4 mt-1 py-4 w-[80%] rounded-sm border botrder-neutral-300'>
                                <input type="text"
                                    placeholder='Enter your Name'
                                    value={form.name}
                                    onChange={(e) => setForm(e.target.value)}
                                    className='outline-none text-md font-normal w-full'
                                />
                            </div>
                        </div>


                        <div className='px-1 py-1 '>
                            <p className='text-lg font-semibold ml-1'>Description</p>
                            <div className='px-4 mt-1 py-4 w-[80%] rounded-sm border botrder-neutral-300'>
                                <input type="text"
                                    placeholder='Enter your Name'
                                    value={form.name}
                                    onChange={(e) => setForm(e.target.value)}
                                    className='outline-none text-md font-normal w-full'
                                />
                            </div>
                        </div>

                    </div>



                    {/*Left halff */}

                    <div className=' w-2/4  px-15  flex  flex-col gap-1 py-10 '>


                        <div className='px-1  py-1'>
                            <p className='text-lg font-semibold ml-1'>About</p>
                            <div className='px-4 mt-1 py-4 w- rounded-sm border botrder-neutral-300'>
                                <input type="text"
                                    placeholder='Enter your Name'
                                    value={form.name}
                                    onChange={(e) => setForm(e.target.value)}
                                    className='outline-none text-md font-normal w-full'
                                />
                            </div>
                        </div>


                        <div className='px-1 py-1 '>
                            <p className='text-lg font-semibold ml-1'>External Links</p>
                            <div className='px-4 mt-1 py-4  rounded-sm border botrder-neutral-300'>
                                <input type="text"
                                    placeholder='Enter your Name'
                                    value={form.name}
                                    onChange={(e) => setForm(e.target.value)}
                                    className='outline-none text-md font-normal w-full'
                                />
                            </div>
                        </div>


                        {/* External Links */}

                        <div className='ml-1 flex flex-col gap-4'>
                            <p className='text-lg font-semibold'>Social Media Links</p>
                            <div className='flex gap-5'>
                                <BsGoogle className='size-9 cursor-pointer' />
                                <BsGithub className='size-9' />
                                <BsLinkedin className='size-9' />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Save Details */}

                <div className='cursor-pointer flex flex-col mt-5 mx-auto items-center justify-center '>

                    <button className=' px-70 py-4 rounded-full bg-pink-700  cursor-pointer'>
                        <p className='text-xl font-semibold text-white'>Continue</p>
                    </button>
                    <div className='flex mt-3 text-neutral-500 text-sm'>
                        <p>already have an account ?</p>
                        <p className='underline text-blue-600'>Login</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SignupPage
