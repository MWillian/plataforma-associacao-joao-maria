import { Router } from 'express';

import { studentController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const studentRouter = Router();

studentRouter.get(
  '/',
  requireAuth,
  requireAdmin,
  studentController.list,
);

studentRouter.post(
  '/',
  requireAuth,
  requireAdmin,
  studentController.create,
);

studentRouter.put(
  '/:id',
  requireAuth,
  requireAdmin,
  studentController.update,
);

studentRouter.patch(
  '/:id/inactivate',
  requireAuth,
  requireAdmin,
  studentController.inactivate,
);
