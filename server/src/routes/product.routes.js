import { Router } from 'express';

import { productController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const productRouter = Router();

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
  productController.inactivate,
);
