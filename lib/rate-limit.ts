// lib/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis instance
const redis = Redis.fromEnv();

// Create rate limiter instances for different routes/actions
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60s"),
  analytics: true,
});

export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60s"),
  analytics: true,
  prefix: "login",
});

export async function checkRateLimit(
  identifier: string,
  limiter = apiRateLimit
) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  return { success, limit, reset, remaining };
}
