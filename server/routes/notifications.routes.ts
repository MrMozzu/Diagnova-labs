import { Router, type Request, type Response } from 'express';
import { NotificationService } from '../services/notification.service';

export const notificationsRouter = Router();

notificationsRouter.post('/dispatch', async (req: Request, res: Response) => {
  try {
    const { booking } = req.body;
    if (!booking || !booking.id) {
      return res.status(400).json({ success: false, message: 'Booking payload required' });
    }

    const result = await NotificationService.dispatchBookingNotifications(booking);
    res.json({
      success: true,
      data: {
        email: result.email,
        whatsapp: result.whatsapp,
        whatsAppDeepLink: NotificationService.getWhatsAppDeepLink(booking)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

notificationsRouter.get('/whatsapp-link/:id', async (req: Request, res: Response) => {
  try {
    const { db } = await import('../services/database.service');
    const booking = await db.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    const link = NotificationService.getWhatsAppDeepLink(booking);
    res.json({ success: true, link });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
