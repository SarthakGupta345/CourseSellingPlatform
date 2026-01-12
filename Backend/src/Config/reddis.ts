import Redis from "ioredis";
import "dotenv/config";

declare global {
  // Prevent multiple instances in dev (Next.js / hot reload)
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

const redis =
  global.redis ||
  new Redis(process.env.REDIS_URL ?? "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

export default redis;
