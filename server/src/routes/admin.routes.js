import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const adminRouter = Router();

// Rota temporária de demonstração do middleware JWT.
// Pode ser removida quando as rotas administrativas reais estiverem prontas.
adminRouter.get('/ping', requireAuth, (req, res) => {
  return res.status(200).json({
    message: 'Rota administrativa autenticada.',
    userId: req.auth.userId,
  });
});
