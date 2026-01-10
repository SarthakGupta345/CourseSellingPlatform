import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import redis from "./Config/reddis"
dotenv.config()

const PORT = process.env.PORT

const app = express()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    // redis.on("connect", () => {
    //     console.log("Connected to Redis ")
    // })
})

console.log("Hello World")
