import express from "express"
import { generateLoginOTP, generateSignupOTP, Login, logout, Signup } from "../Controllers/auth.controller"

const router = express.Router()

router.post("/generateLoginOTP", generateLoginOTP)
router.post("/login", Login);
router.post('/generateSignupOTP', generateSignupOTP)
router.post("/signup",Signup)
router.post('/logout', logout)


export default router