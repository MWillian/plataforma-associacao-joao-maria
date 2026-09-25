import { Router } from 'express';

import { productController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';
import {
  productListRateLimit,
} from '../middlewares/rate-limit.middleware.js';

export const productRouter = Router();

productRouter.get(
  '/',
  productListRateLimit,
  productController.list,
);

productRouter.post(
  '/',
  requireAuth,
  requireAdmin,
  productController.create,
);

productRouter.put(
  '/:id',
  requireAuth,
  requireAdmin,
  productController.update,
);

productRouter.patch(
  '/:id/inactivate',
  requireAuth,
  requireAdmin,
  productController.inactivate,
);

productRouter.patch(
  '/:id/activate',
  requireAuth,
  requireAdmin,
  productController.activate,
);
