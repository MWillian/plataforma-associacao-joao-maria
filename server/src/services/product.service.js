import { AppError } from '../utils/app-error.js';

const PRODUCT_CATEGORIES = [
  'agricultura',
  'artesanato',
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PRODUCT_PAGE_SIZE = 10;

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async list({ page: rawPage } = {}) {
    const pageValue =
      rawPage === undefined
        ? '1'
        : String(rawPage).trim();

    if (
      Array.isArray(rawPage) ||
      !/^[1-9]\d*$/.test(pageValue)
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A página deve ser um número inteiro maior que zero.',
      );
    }

    const page = Number(pageValue);

    if (!Number.isSafeInteger(page)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A página informada é inválida.',
      );
    }

    const skip = (page - 1) * PRODUCT_PAGE_SIZE;

    if (!Number.isSafeInteger(skip)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A página informada é inválida.',
      );
    }

    const { items, totalItems } =
      await this.productRepository.listActive({
        skip,
        take: PRODUCT_PAGE_SIZE,
      });

    return {
      items,
      pagination: {
        page,
        limit: PRODUCT_PAGE_SIZE,
        totalItems,
        totalPages: Math.ceil(
          totalItems / PRODUCT_PAGE_SIZE,
        ),
      },
    };
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

    try {
      return await this.productRepository.create({
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
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new AppError(
          409,
          'PRODUCT_ALREADY_EXISTS',
          'Já existe um produto com este título.',
        );
      }

      throw error;
    }
  }

  async inactivate(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O identificador do produto é inválido.',
      );
    }

    const product = await this.productRepository.findById(
      id,
    );

    if (!product) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        'Produto não encontrado.',
      );
    }

    if (!product.active) {
      return product;
    }

    const inactiveProduct =
      await this.productRepository.inactivate(id);

    if (!inactiveProduct) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        'Produto não encontrado.',
      );
    }

    return inactiveProduct;
  }

  async activate(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O identificador do produto é inválido.',
      );
    }

    const product = await this.productRepository.findById(
      id,
    );

    if (!product) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        'Produto não encontrado.',
      );
    }

    if (product.active) {
      return product;
    }

    const activeProduct =
      await this.productRepository.activate(id);

    if (!activeProduct) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        'Produto não encontrado.',
      );
    }

    return activeProduct;
  }

  async update(id, data = {}) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O identificador do produto é inválido.',
      );
    }

    const product = await this.productRepository.findById(
      id,
    );

    if (!product) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        'Produto não encontrado.',
      );
    }

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

    if (active !== undefined) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O campo active não pode ser alterado neste endpoint.',
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

    const productWithSameTitle =
      await this.productRepository.findByTitle(
        normalizedTitle,
      );

    if (
      productWithSameTitle &&
      productWithSameTitle.id !== id
    ) {
      throw new AppError(
        409,
        'PRODUCT_ALREADY_EXISTS',
        'Já existe um produto com este título.',
      );
    }

    try {
      const updatedProduct =
        await this.productRepository.update(id, {
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
        });

      if (!updatedProduct) {
        throw new AppError(
          404,
          'PRODUCT_NOT_FOUND',
          'Produto não encontrado.',
        );
      }

      return updatedProduct;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new AppError(
          409,
          'PRODUCT_ALREADY_EXISTS',
          'Já existe um produto com este título.',
        );
      }

      throw error;
    }
  }
}
