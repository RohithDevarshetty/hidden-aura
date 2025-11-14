import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Check if Redis is properly configured
    if (!url || !token || url.startsWith('your-') || token.startsWith('your-')) {
      console.warn('Redis credentials not found or not configured. Rate limiting and caching will be disabled.');
      // Return a mock Redis client for development
      return {
        get: async () => null,
        set: async () => 'OK',
        incr: async () => 1,
        expire: async () => 1,
        del: async () => 1,
        zadd: async () => 1,
        zrange: async () => [],
        zrem: async () => 1,
      } as any;
    }

    redis = new Redis({
      url,
      token,
    });
  }

  return redis;
}

// Don't export a default instance - always use getRedis() function
export default getRedis;
