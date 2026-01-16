import express, { Request } from "express"

interface User {
    id: int,
    email: string,
    role:string ="CUSTOMER"
}

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}