import express from "express"
import { generateLoginOTP, generateSignupOTP, Login, logout, Me, Signup } from "../Controllers/auth.controller"
import { authMiddleware } from "../Middlewares/auth.middleware";

const router = express.Router()

router.post("/generateLoginOTP", generateLoginOTP)
router.post("/login", Login);
router.post('/generateSignupOTP', generateSignupOTP)
router.post("/signup",Signup)
router.post('/logout', logout)
router.get("/me",authMiddleware,Me);

export default router