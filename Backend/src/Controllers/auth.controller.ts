import { prisma } from "../Config/prisma"
import { authSchema } from "../Schema/auth.schema"
import { Request, Response } from "express"
import bcrypt from "bcrypt"
export const signupWithEmail = async (req: Request, res: Response) => {
    try {
        const parsed = authSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json(parsed.error)
        }
        const { email, password } = parsed.data;
        const existingUser = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data:{
                email:email.toString(),
                password:hashedPassword
            }
        })
        return res.status(201).json(user)
    } catch (error) {

    }
}


export const loginWithEmail = async(req:Request,res:Response)=>{
    try {
        const parsed = authSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json(parsed.error)
        }
        const { email } = parsed.data;
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isPasswordValid = bcrypt.compareSync(
            parsed.data.password,
            user?.password||""
        )

        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"})
        }
        return res.status(200).json(user)
        
    } catch (error) {
        
    }
}

