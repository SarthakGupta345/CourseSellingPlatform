import { useMutation } from "@tanstack/react-query";
import { generateSignupOTP, Signup } from "@/api/auth.api";
import { signupData } from "@/api/auth.api";

export const useGenerateSignupOTP = () => {
  return useMutation({
    mutationFn: ({ name, email }: { name: string; email: string }) =>
      generateSignupOTP(name, email),
    onError: (error) => {
      console.log(error);
    },
    retry: 0,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: signupData) => Signup(data),
    retry: 0,
    
  });
};
