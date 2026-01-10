import express, { Request } from "express"

interface User {
    id: int,
    email: string,
}

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}