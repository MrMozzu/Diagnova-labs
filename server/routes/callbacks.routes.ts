import { Router, type Request, type Response, type NextFunction } from 'express';
import { ServerCallbackService } from '../services/callback.service';

export const callbacksRouter = Router();

callbacksRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await ServerCallbackService.createCallbackLead(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
});

callbacksRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await ServerCallbackService.listCallbacks();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    next(err);
  }
});
