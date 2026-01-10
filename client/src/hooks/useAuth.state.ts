import { generateSignupOTP, Signup, signupData } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export const useGenerateSignupOTP = (name: string, email: string) => {
    return useQuery({
        queryKey: ["generateSignupOTP", email],
        queryFn: () => generateSignupOTP(name, email),
    });
};

export const useSignup = (data: signupData) => {
    return useQuery({
        queryKey: ["signup", data],
        queryFn: () => Signup(data),
    });
};

