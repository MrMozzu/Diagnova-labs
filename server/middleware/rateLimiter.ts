import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function createRateLimiter(options: { windowMs: number; maxRequests: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + options.windowMs
      });
      return next();
    }

    if (record.count >= options.maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests. Please slow down and try again later.',
          retryAfterMs: Math.max(0, record.resetTime - now)
        }
      });
      return;
    }

    record.count++;
    next();
  };
}

// General API limiter: 150 requests per minute
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 150
});

// Strict Booking limiter: 15 bookings per 5 minutes per IP
export const bookingLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  maxRequests: 15,
  message: 'Booking request limit reached for this IP. Please wait a few moments before trying again.'
});
