import { Router } from 'express';

import {
  classController,
  studentController,
} from '../container.js';
import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';

export const classRouter = Router();

// Turmas públicas para a página do Estúdio.
classRouter.get('/public', classController.list);

// Todas as rotas de turmas exigem administrador autenticado.
classRouter.use(requireAuth, requireAdmin);

classRouter.get('/', classController.list);
classRouter.post('/', classController.create);
classRouter.put('/:id', classController.update);
classRouter.patch('/:id/inactivate', classController.inactivate);

// Alunos de uma turma
classRouter.get('/:classId/students', studentController.listByClass);
classRouter.post('/:classId/students', studentController.enroll);
classRouter.delete(
  '/:classId/students/:studentId',
  studentController.unenroll,
);
