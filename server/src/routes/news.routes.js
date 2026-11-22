import { Router } from 'express';
import { newsController } from '../container.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';

export const newsRouter = Router();

newsRouter.get('/highlights', newsController.listHighlights);
newsRouter.get('/:id', newsController.findById);
newsRouter.get('/', newsController.list);
newsRouter.post('/', requireAuth, requireAdmin, newsController.create);
newsRouter.put('/:id', requireAuth, requireAdmin, newsController.update);
newsRouter.patch('/:id/inactivate', requireAuth, requireAdmin, newsController.inactivate);
