import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Math.random().toString(36).substring(2, 9)}`;
  req.headers['x-request-id'] = requestId as string;
  res.setHeader('X-Request-Id', requestId as string);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    console.log(
      `[${new Date().toISOString()}] ${color}${req.method} ${req.originalUrl} ${status}${reset} - ${duration}ms [${requestId}]`
    );
  });

  next();
}
