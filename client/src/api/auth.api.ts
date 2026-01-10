import axiosInstance from "@/Config/axios"

export const verifyEmail = async (email: string) => {
    const res = await axiosInstance.post("/api/v1/auth/verify-email", { email })
    return res
}