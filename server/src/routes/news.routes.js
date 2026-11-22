import { Router } from 'express';

import { newsController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';
import {
  productListRateLimit,
} from '../middlewares/rate-limit.middleware.js';

export const newsRouter = Router();

// Público: alimenta Home, murais e detalhe das notícias.
newsRouter.get('/', productListRateLimit, newsController.list);

newsRouter.post('/', requireAuth, requireAdmin, newsController.create);
newsRouter.put('/:id', requireAuth, requireAdmin, newsController.update);
newsRouter.patch(
  '/:id/unpublish',
  requireAuth,
  requireAdmin,
  newsController.unpublish,
);
