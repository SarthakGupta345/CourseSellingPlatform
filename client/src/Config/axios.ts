import axios from "axios"

export const axiosInstance = await axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})

export default axiosInstance

axiosInstance.interceptors.response.use((response) => response, (error) => Promise.reject(error))