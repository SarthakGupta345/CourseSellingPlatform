import z from "zod";

export const validSignupSchemaSchema = z.object({
    email: z.string().email("Email is not valid"),
    name: z.string('Name should be between 3 and 30 characters').min(3).max(30),
    otp: z.string('OTP should be 6 digits').min(6,'OTP should be 6 digits').max(6,'OTP should be 6 digits'),
});



