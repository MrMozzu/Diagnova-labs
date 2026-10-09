import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.headers['x-request-id'] || 'unknown';
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected server error occurred.';

  // Structured server-side error logging
  if (statusCode >= 500) {
    console.error(`[ERROR] [${requestId}] Internal Server Error:`, err);
  } else {
    console.warn(`[WARN] [${requestId}] Client Error (${statusCode} - ${code}): ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: err.details || undefined,
      requestId
    }
  });
}
