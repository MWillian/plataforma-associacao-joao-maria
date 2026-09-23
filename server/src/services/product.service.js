import { createProduct as createProductRepository } from '../repositories/product.repository.js';
import { AppError } from '../utils/app-error.js';

export async function createProductService(data) {
  const { title, description, category, imageUrl, active } = data;

  if (!title || title.trim() === '') {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'O título do produto é obrigatório.',
    );
  }

  if (!category || category.trim() === '') {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'A categoria do produto é obrigatória.',
    );
  }

  return await createProductRepository({
    title: title.trim(),
    description: description?.trim() || null,
    category: category.trim(),
    imageUrl: imageUrl?.trim() || null,
    active: active ?? true,
  });
}