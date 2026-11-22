import { Router } from 'express';
<<<<<<< HEAD
import { noticeController } from '../container.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';

export const noticeRouter = Router();
=======

import { noticeController } from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const noticeRouter = Router();

>>>>>>> origin/main
noticeRouter.use(requireAuth, requireAdmin);

noticeRouter.get('/', noticeController.list);
noticeRouter.post('/', noticeController.create);
<<<<<<< HEAD
noticeRouter.post('/:id/send', noticeController.send);
=======
>>>>>>> origin/main
noticeRouter.delete('/:id', noticeController.remove);
