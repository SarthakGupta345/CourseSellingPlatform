import { useMutation, useQuery } from "@tanstack/react-query";
import {
  generateSignupOTP,
  ME,
  Signup,
  signupData,
} from "@/api/auth.api";
import axios from "axios";

/* ---------------------------------- */
/* Generate Signup OTP */
/* ---------------------------------- */

interface GenerateOtpPayload {
  name: string;
  email: string;
}

export const useGenerateSignupOTP = () => {
  return useMutation({
    mutationKey: ["auth", "generate-otp"],
    mutationFn: async ({ name, email }: GenerateOtpPayload) => {
      const res = await generateSignupOTP(name, email);
      return res;
    },
    retry: false,
  });
};

/* ---------------------------------- */
/* Signup */
/* ---------------------------------- */

export const useSignup = () => {
  return useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: async (data: signupData) => {
      const res = await Signup(data);
      return res;
    },
    retry: false,
  });
};

/* ---------------------------------- */
/* Verify Logged-in User */
/* ---------------------------------- */

export interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}


export const useVerifiedLogin = () => {
  return useQuery<AuthResponse>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const res = await ME();
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            return {
              authenticated: false,
            };
          }
        }
        // ❗ Unknown / server error → let React Query handle it
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
