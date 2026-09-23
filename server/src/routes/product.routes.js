import { Router } from 'express';
import { createProductController } from '../controllers/product.controller.js';

export const productRouter = Router();

productRouter.post('/', createProductController);