import express from 'express';
import cors from 'cors';
import { config } from './config';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import { healthRouter } from './routes/health.routes';
import { catalogRouter } from './routes/catalog.routes';
import { pricingRouter } from './routes/pricing.routes';
import { slotsRouter } from './routes/slots.routes';
import { bookingsRouter } from './routes/bookings.routes';
import { callbacksRouter } from './routes/callbacks.routes';
import { pincodeRouter } from './routes/pincode.routes';

export function createApp() {
  const app = express();

  // 1. Core Security & Parsing Middleware
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // 2. Telemetry & Rate Limiting
  app.use(requestLogger);
  app.use('/api', apiLimiter);

  // 3. API Routes
  app.use('/api/health', healthRouter);
  app.use('/api', catalogRouter);
  app.use('/api/pricing', pricingRouter);
  app.use('/api/slots', slotsRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/callbacks', callbacksRouter);
  app.use('/api/pincode', pincodeRouter);

  // 4. 404 Catch-All
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'The requested API route does not exist.'
      }
    });
  });

  // 5. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
