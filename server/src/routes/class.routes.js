import { Router } from 'express';

import { classController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const classRouter = Router();

classRouter.post(
  '/',
  requireAuth,
  requireAdmin,
  classController.create,
);

classRouter.put(
  '/:id',
  requireAuth,
  requireAdmin,
  classController.update,
);

classRouter.patch(
  '/:id/inactivate',
  requireAuth,
  requireAdmin,
  classController.inactivate,
);
