import { Router, type Request, type Response, type NextFunction } from 'express';
import { ServerPricingService } from '../services/pricing.service';
import { AppError } from '../middleware/errorHandler';

export const pricingRouter = Router();

pricingRouter.post('/calculate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, isExpress } = req.body;
    if (!items || !Array.isArray(items)) {
      throw new AppError('Items array is required for pricing calculation.', 400, 'INVALID_PAYLOAD');
    }

    const calculation = ServerPricingService.calculateCart(items, !!isExpress);
    res.json({ success: true, data: calculation });
  } catch (err) {
    next(err);
  }
});
