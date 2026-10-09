import { Router, type Request, type Response, type NextFunction } from 'express';
import { ServerCatalogService } from '../services/catalog.service';
import { AppError } from '../middleware/errorHandler';

export const catalogRouter = Router();

catalogRouter.get('/tests', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, category, sort, page, pageSize } = req.query;
    const result = ServerCatalogService.getTests({
      query: q as string,
      category: category as string,
      sort: sort as string,
      page: page ? parseInt(page as string, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : 12
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/tests/:idOrSlug', (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = ServerCatalogService.getTestByIdOrSlug(req.params.idOrSlug);
    if (!item) {
      throw new AppError(`Test '${req.params.idOrSlug}' not found.`, 404, 'NOT_FOUND');
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/packages', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, category } = req.query;
    const items = ServerCatalogService.getPackages({
      query: q as string,
      category: category as string
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/packages/:idOrSlug', (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = ServerCatalogService.getPackageByIdOrSlug(req.params.idOrSlug);
    if (!item) {
      throw new AppError(`Package '${req.params.idOrSlug}' not found.`, 404, 'NOT_FOUND');
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/cities', (_req: Request, res: Response) => {
  res.json({ success: true, data: ServerCatalogService.getCities() });
});
