import z from "zod";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const authSchema = z.object({
    name: z.string('Not a valid name').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be at most 50 characters long'),
    email: z.string('Not a valid email').email('Not a valid email'),
});


export const loginSchema = z.object({
    email: z.string('Not a valid email').email('Not a valid email'),
    otp: z.string('Not a valid otp').min(6, 'Otp must be at least 6 characters long').max(6, 'Otp must be at most 6 characters long'),
})


export const emailSchema = z.object({
    email: z.string('Not a valid email').email('Not a valid email')
})


export const signupSchema = z.object({
    name: z.string('Not a valid name').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be at most 50 characters long'),
    email: z.string('Not a valid email').email('Not a valid email'),
    otp: z.string('Not a valid otp').min(6, 'Otp must be at least 6 characters long').max(6, 'Otp must be at most 6 characters long'),
});