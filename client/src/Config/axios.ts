import axios from "axios"
import { queryClient } from "./reactQuery";

export const axiosInstance = await axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})

export default axiosInstance

axiosInstance.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            queryClient.setQueryData(["auth", "me"], {
                authenticated: false,
            });
        }
        return Promise.reject(err);
    }
);
