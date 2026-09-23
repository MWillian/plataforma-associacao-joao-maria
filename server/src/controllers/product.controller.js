import { createProductService } from '../services/product.service.js';

export async function createProductController(req, res, next) {
  try {
    const product = await createProductService(req.body ?? {});

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}