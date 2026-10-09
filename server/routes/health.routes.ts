import { Router, type Request, type Response } from 'express';
import { config } from '../config';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'HEALTHY',
    service: 'TestBuddyLabs-Diagnova-API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    environment: config.nodeEnv,
    supabaseConnected: Boolean(config.supabase.url && config.supabase.anonKey),
    memoryUsageMB: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  });
});
