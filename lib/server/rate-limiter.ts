import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // timestamp in ms
}

// ─── IN-MEMORY SLIDING WINDOW (LOCAL DEV & TESTING ONLY) ────────────────────

interface MemoryBucket {
  timestamps: number[];
}

const memoryBuckets = new Map<string, MemoryBucket>();

// Periodic memory bucket cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of memoryBuckets.entries()) {
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 300_000);
      if (bucket.timestamps.length === 0) {
        memoryBuckets.delete(key);
      }
    }
  }, 300_000);
}

function checkInMemoryRateLimit(
  identifier: string,
  limit: number,
  windowSec: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const cutoff = now - windowMs;

  let bucket = memoryBuckets.get(identifier);
  if (!bucket) {
    bucket = { timestamps: [] };
    memoryBuckets.set(identifier, bucket);
  }

  // Filter timestamps within window
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] || now;
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldest + windowMs,
    };
  }

  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - bucket.timestamps.length,
    resetAt: now + windowMs,
  };
}

// ─── UPSTASH REDIS RATE LIMITER (PRODUCTION DISTRIBUTED) ────────────────────

let upstashRedisInstance: Redis | null = null;
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(limit: number, windowSec: number): Ratelimit {
  const cacheKey = `${limit}:${windowSec}`;
  let limiter = upstashLimiters.get(cacheKey);

  if (!limiter) {
    if (!upstashRedisInstance) {
      upstashRedisInstance = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
    }

    limiter = new Ratelimit({
      redis: upstashRedisInstance,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      analytics: true,
      prefix: 'taj_saas_ratelimit',
    });

    upstashLimiters.set(cacheKey, limiter);
  }

  return limiter;
}

/**
 * Unified Rate Limiter.
 * Production requires UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN.
 * If unconfigured in production, fails closed to prevent security bypass.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasUpstashConfig =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (isProduction) {
    if (!hasUpstashConfig) {
      console.error(
        '[RateLimiter CRITICAL] UPSTASH_REDIS_REST_URL/TOKEN is not set in production. Failing closed.'
      );
      return {
        allowed: false,
        remaining: 0,
        resetAt: Date.now() + windowSec * 1000,
      };
    }

    try {
      const ratelimit = getUpstashLimiter(limit, windowSec);
      const result = await ratelimit.limit(identifier);

      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch (err) {
      console.error('[RateLimiter Error] Upstash request failed:', err);
      // Fallback in case of temporary network glitch in production
      return {
        allowed: false,
        remaining: 0,
        resetAt: Date.now() + 5000,
      };
    }
  }

  // Local development / CI test runner
  if (hasUpstashConfig) {
    try {
      const ratelimit = getUpstashLimiter(limit, windowSec);
      const result = await ratelimit.limit(identifier);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch {
      return checkInMemoryRateLimit(identifier, limit, windowSec);
    }
  }

  return checkInMemoryRateLimit(identifier, limit, windowSec);
}

export const RATE_LIMIT_PRESETS: Record<string, { limit: number; windowSec: number }> = {
  order_creation: { limit: 10, windowSec: 60 },
  order_tracking: { limit: 60, windowSec: 60 },
  order_cancellation: { limit: 5, windowSec: 60 },
  upload_proof: { limit: 10, windowSec: 60 },
  validate_promo: { limit: 20, windowSec: 60 },
  customer_chat: { limit: 20, windowSec: 60 },
};

export const rateLimiter = {
  check: (
    identifier: string,
    feature: keyof typeof RATE_LIMIT_PRESETS | { limit: number; windowSec: number }
  ) => {
    const preset =
      typeof feature === 'string'
        ? RATE_LIMIT_PRESETS[feature] || { limit: 30, windowSec: 60 }
        : feature;
    return checkRateLimit(
      `${typeof feature === 'string' ? feature : 'custom'}:${identifier}`,
      preset.limit,
      preset.windowSec
    );
  },
};
