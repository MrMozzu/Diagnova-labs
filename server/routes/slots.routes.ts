import { Router, type Request, type Response, type NextFunction } from 'express';
import { ServerSlotService } from '../services/slot.service';
import { AppError } from '../middleware/errorHandler';

export const slotsRouter = Router();

slotsRouter.get('/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, pincode } = req.query;
    if (!date) {
      throw new AppError('Query parameter "date" (YYYY-MM-DD) is required.', 400, 'MISSING_PARAM');
    }

    const targetPincode = (pincode as string) || '';
    const slots = await ServerSlotService.getSlotAvailability(date as string, targetPincode);
    res.json({ success: true, data: { date, pincode: targetPincode, slots } });
  } catch (err) {
    next(err);
  }
});
