"use client"
import OTPPopup from "@/components/Auth/OTPpopup"
import MainHeader from "@/components/Header/mainHeader"
import PriceHeader from "@/components/Header/PriceHeader"
import MainPage from "@/components/Home/mainPage"
import FeaturesBox from "@/components/Home/slidingBox"
import SlidingBox from "@/components/Home/slidingBox"
import { useAppSelector } from "@/Store/hooks"
import { setAuth } from "@/Store/slices/auth.slice"
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

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (


    <MainPage />



  )
}

export default HomePage
