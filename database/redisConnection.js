import { createClient } from "redis";

export const redis = createClient();

export const redisConnection = () => {
  redis
    .on("connect", () => {
      console.log("Connected to Redis");
    })
    .on("error", (err) => {
      console.log("Error: " + err);
    });

  redis.connect();

  return redis;
};
