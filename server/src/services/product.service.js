import { AppError } from '../utils/app-error.js';

const PRODUCT_CATEGORIES = [
  'agricultura',
  'artesanato',
];

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async create(data = {}) {
    const {
      title,
      description,
      category,
      imageUrl,
      active,
    } = data;

    if (typeof title !== 'string' || title.trim() === '') {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O título do produto é obrigatório.',
      );
    }

    if (
      typeof category !== 'string' ||
      category.trim() === ''
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A categoria do produto é obrigatória.',
      );
    }

    const normalizedTitle = title.trim().toLowerCase();
    const normalizedCategory = category
      .trim()
      .toLowerCase();

    if (!PRODUCT_CATEGORIES.includes(normalizedCategory)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A categoria deve ser agricultura ou artesanato.',
        { category: PRODUCT_CATEGORIES },
      );
    }

    if (active !== undefined && typeof active !== 'boolean') {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O campo active deve ser booleano.',
      );
    }

    const existingProduct =
      await this.productRepository.findByTitle(
        normalizedTitle,
      );

    if (existingProduct) {
      throw new AppError(
        409,
        'PRODUCT_ALREADY_EXISTS',
        'Já existe um produto com este título.',
      );
    }

    return this.productRepository.create({
      title: normalizedTitle,
      description:
        typeof description === 'string'
          ? description.trim() || null
          : null,
      category: normalizedCategory,
      imageUrl:
        typeof imageUrl === 'string'
          ? imageUrl.trim() || null
          : null,
      active: active ?? true,
    });
  }
}
