import { Router } from 'express';
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  resetPasswordController,
} from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
authRouter.post('/forgot-password', forgotPasswordController);
authRouter.post('/reset-password', resetPasswordController);
