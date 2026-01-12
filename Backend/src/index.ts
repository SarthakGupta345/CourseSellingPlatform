import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
import helmet from "helmet"
import authRoutes from "./routes/auth.route"
const PORT = process.env.PORT

const app = express()

app.use(express.json({
    limit: "50mb"
}))


app.use(cookieParser())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get("/", (req, res) => {
    res.send("Hello World It is Working Correctly")
})

console.log("Hello World")

app.use("/api/v1/auth", authRoutes);
