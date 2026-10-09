import { Router, type Request, type Response, type NextFunction } from 'express';
import { ServerPincodeService } from '../services/pincode.service';

export const pincodeRouter = Router();

pincodeRouter.get('/:pincode', (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = ServerPincodeService.lookup(req.params.pincode);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});
