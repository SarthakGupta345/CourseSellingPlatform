"use client"
import MainHeader from "@/components/Header/mainHeader"
import PriceHeader from "@/components/Header/PriceHeader"
import motion from "framer-motion"
import React from 'react'

const options = [
  {
    name: "Machine Learning",
    iconPhoto: "",
    link: "/machine-learning"
  }, {
    name: "Data Science",
    iconPhoto: "",
    link: "/data-science"
  }, {
    name: "Web Development",
    iconPhoto: "",
    link: "/web-development"
  }, {
    name: "Mobile Development",
    iconPhoto: "",
    link: "/mobile-development"
  }, {
    name: "Artificial Intelligence",
    iconPhoto: "",
    link: "/artificial-intelligence"
  }, {
    name: "Cloud Computing",
    iconPhoto: "",
    link: "/cloud-computing"
  }
]

const HomePage = () => {
  return (


    <div className='w-full bg-white h-full p-4'>
      This is a Home page

      {/* Learning */}

      <div className='mx-auto'>
        <p className='text-5xl text-black  font-medium'
          style={{ fontFamily: "-apple-system" }}
        >Learn Anything You Want</p>

        <div className='flex gap-3'>
          <div className='rounded-full px-5 cursor-pointer py-3 border border-red-500'>
            <p>Machine Learning</p>
          </div>
          <div className='rounded-full px-5 cursor-pointer py-3 border border-red-500'>
            <p>Machine Learning</p>
          </div>
          {
            options.map((option) => {
              return (
                <div className='rounded-full px-5 cursor-pointer py-3 border border-red-500 '>
                  <p>{option.name}</p>
                </div>
              )
            })
          }
        </div>
      </div>

      <div>
        <p>
          Discover the World of Learning
        </p>
      </div>



    </div>

  )
}

export default HomePage
