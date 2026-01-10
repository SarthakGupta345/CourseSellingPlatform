import Redis from "ioredis"
import "dotenv/config"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

export default redis

redis.on("connect", () => {
    console.log("Connected to Redis")
})

redis.on("error", (error) => {
    console.error("Redis connection error:", error)
})