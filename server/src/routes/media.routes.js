import { Router, raw } from 'express';
import { mediaController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const mediaRouter = Router();

mediaRouter.use(requireAuth, requireAdmin);

mediaRouter.post(
  '/images/:folder',
  raw({ type: () => true, limit: '6mb' }),
  mediaController.uploadImage,
);

mediaRouter.delete('/images', mediaController.deleteImage);
