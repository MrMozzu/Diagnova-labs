import type { Request, Response, NextFunction } from 'express';

interface IdempotentResponse {
  statusCode: number;
  body: any;
  timestamp: number;
}

const idempotencyStore = new Map<string, IdempotentResponse>();

export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = (req.headers['x-idempotency-key'] || req.body?.idempotencyKey) as string;

  if (!key) {
    return next();
  }

  const cached = idempotencyStore.get(key);
  if (cached) {
    res.setHeader('X-Cache-Lookup', 'HIT');
    res.status(cached.statusCode).json(cached.body);
    return;
  }

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyStore.set(key, {
        statusCode: res.statusCode,
        body,
        timestamp: Date.now()
      });
    }
    return originalJson(body);
  };

  next();
}
