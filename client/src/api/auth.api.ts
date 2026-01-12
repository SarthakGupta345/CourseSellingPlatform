import axiosInstance from "@/Config/axios"
import { AuthResponse } from "@/hooks/useAuth.state"

export const verifyEmail = async (email: string) => {
    const res = await axiosInstance.post("/api/v1/auth/verify-email", { email })
    return res
}

export const generateSignupOTP = async (name: string, email: string) => {
    const res = await axiosInstance.post("/auth/generateSignupOTP", {
        email,
        name
    })
    return res
}

export const Signup = async (data: signupData) => {
    const res = await axiosInstance.post("/auth/signup", data)
    return res
}
export interface signupData {
    email: string,
    name: string,
    otp: string
}


export const ME = async () => {
    const res = await axiosInstance.get<AuthResponse>("/auth/me")
    return res
}