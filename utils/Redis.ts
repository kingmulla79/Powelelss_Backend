require("dotenv").config();
import { Redis } from "ioredis";

export const redis = new Redis();

// const redisClient = () => {
//   if (process.env.REDIS_URL) {
//     console.log("Redis connected");
//     return process.env.REDIS_URL;
//   }
//   throw new Error("Redis connection failed");
// };

// export const redis = new Redis(redisClient());
