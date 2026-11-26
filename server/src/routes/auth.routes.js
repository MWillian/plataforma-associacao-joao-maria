import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshController,
} from '../controllers/auth.controller.js';
import { loginRateLimit } from '../middlewares/rate-limit.middleware.js';

export const authRouter = Router();

authRouter.post('/login', loginRateLimit, loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
