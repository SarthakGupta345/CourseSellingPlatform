import z from "zod";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const authSchema = z.object({
    email: z.string('Not a valid email').email('Not a valid email'),
    password: z.string().regex(passwordRegex, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'),
});