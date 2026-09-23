import { Router } from 'express';

import {
  requireAdmin,
  requireAuth,
} from '../middlewares/auth.middleware.js';
import { productRouter } from './product.routes.js';

export const adminRouter = Router();

// Todas as rotas declaradas abaixo destes middlewares exigirão autenticação administrativa.
adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);

adminRouter.use('/products', productRouter)
// Rota temporária para testar a autorização.
// Remover quando as rotas administrativas reais estiverem implementadas.
adminRouter.get('/ping', (req, res) => {
  return res.status(200).json({
    message:
      'Rota administrativa autenticada.',
    userId: req.auth.userId,
    isAdmin: req.auth.isAdmin,
  });
});
