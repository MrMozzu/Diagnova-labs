import { Router, type Request, type Response, type NextFunction } from 'express';
import { ServerBookingService } from '../services/booking.service';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { bookingLimiter } from '../middleware/rateLimiter';

export const bookingsRouter = Router();

bookingsRouter.post(
  '/',
  bookingLimiter,
  idempotencyMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await ServerBookingService.createBooking(req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  }
);

bookingsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await ServerBookingService.listBookings();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    next(err);
  }
});

bookingsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await ServerBookingService.getBookingById(req.params.id);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

bookingsRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const booking = await ServerBookingService.updateStatus(req.params.id, status);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});
