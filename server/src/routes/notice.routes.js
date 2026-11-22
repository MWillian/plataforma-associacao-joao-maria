import { Router } from 'express';

import { noticeController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const noticeRouter = Router();

noticeRouter.use(requireAuth, requireAdmin);

noticeRouter.get('/', noticeController.list);
noticeRouter.post('/', noticeController.create);
noticeRouter.delete('/:id', noticeController.remove);
