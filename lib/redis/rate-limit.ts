import { getRedis } from './client';

export interface RateLimitConfig {
  max: number;  // Maximum number of requests
  window: number;  // Time window in seconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedis();
  const fullKey = `rate:${key}`;

  try {
    const current = await redis.get<number>(fullKey) || 0;

    if (current >= config.max) {
      const ttl = await redis.ttl(fullKey);
      return {
        success: false,
        limit: config.max,
        remaining: 0,
        reset: Date.now() + (ttl * 1000),
      };
    }

    const count = await redis.incr(fullKey);

    // Set expiry only on first request
    if (count === 1) {
      await redis.expire(fullKey, config.window);
    }

    return {
      success: true,
      limit: config.max,
      remaining: config.max - count,
      reset: Date.now() + (config.window * 1000),
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow the request if Redis is down
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: Date.now() + (config.window * 1000),
    };
  }
}

// Specific rate limit functions
export async function checkAnswerRateLimit(
  deviceHash: string,
  questionId: string
): Promise<RateLimitResult> {
  // 3 answers per question per device per day
  return rateLimit(`answer:${deviceHash}:${questionId}`, {
    max: 3,
    window: 86400, // 24 hours
  });
}

export async function checkTotalAnswerRateLimit(
  deviceHash: string
): Promise<RateLimitResult> {
  // 10 total answers per device per hour
  return rateLimit(`answer:${deviceHash}:total`, {
    max: 10,
    window: 3600, // 1 hour
  });
}

export async function checkIPAnswerRateLimit(
  ipHash: string
): Promise<RateLimitResult> {
  // 20 answers per IP per hour
  return rateLimit(`answer:${ipHash}:total`, {
    max: 20,
    window: 3600, // 1 hour
  });
}

export async function checkUsernameCreationRateLimit(
  ipHash: string
): Promise<RateLimitResult> {
  // 3 usernames per IP per day
  return rateLimit(`username:${ipHash}`, {
    max: 3,
    window: 86400, // 24 hours
  });
}

export async function checkAPIRateLimit(
  ipHash: string,
  endpoint: string
): Promise<RateLimitResult> {
  // 100 requests per IP per minute per endpoint
  return rateLimit(`api:${ipHash}:${endpoint}`, {
    max: 100,
    window: 60, // 1 minute
  });
}

export async function checkAccessCodeAttempts(
  accessCode: string,
  ipHash: string
): Promise<RateLimitResult> {
  // 5 attempts per access code per IP per 15 minutes
  return rateLimit(`access:attempt:${accessCode}:${ipHash}`, {
    max: 5,
    window: 900, // 15 minutes
  });
}
