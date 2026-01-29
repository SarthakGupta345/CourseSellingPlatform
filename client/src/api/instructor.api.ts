import axiosInstance from "@/Config/axios";

const BASE_URL = "/api/v1/instructor"
export const generateSignupOTPInstructor = async(email:string)=>{
    const res = await axiosInstance.post(`${BASE_URL}/generateSignupOTP`,{email})
}