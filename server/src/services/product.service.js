import { AppError } from '../utils/app-error.js';
import { validateImages } from '../utils/images.js';

const PRODUCT_CATEGORIES = [
  'agricultura',
  'artesanato',
];

const PRODUCT_CATEGORY_TO_DB = {
  agricultura: 'AGRICULTURE',
  artesanato: 'CRAFTS',
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PRODUCT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;
const MAX_PRODUCT_IMAGES = 3;
const MAX_PRICE = 99999999.99;

// O front envia AGRICULTURE/CRAFTS; a API também aceita os nomes em português.
const CATEGORY_ALIASES = {
  agricultura: 'agricultura',
  agriculture: 'agricultura',
  'agricultura familiar': 'agricultura',
  artesanato: 'artesanato',
  crafts: 'artesanato',
};

function normalizeCategory(value) {
  return (
    CATEGORY_ALIASES[String(value).trim().toLowerCase()] ??
    String(value).trim().toLowerCase()
  );
}

// Preço opcional: número >= 0 com no máximo 2 casas decimais.
function validatePrice(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > MAX_PRICE ||
    Math.round(value * 100) / 100 !== value
  ) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'O preço deve ser um número maior ou igual a zero, com até 2 casas decimais.',
      { price: 'Preço inválido.' },
    );
  }

  return value;
}

function validateProductImages(images) {
  const fields = {};
  const urls = validateImages(
    images,
    { max: MAX_PRODUCT_IMAGES },
    fields,
  );

  if (Object.keys(fields).length > 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Imagens do produto inválidas.',
      fields,
    );
  }

  return urls;
}

// Preço (Decimal) sai como número no JSON.
function toProductResponse(product) {
  if (!product || product.price === null || product.price === undefined) {
    return product;
  }

  return { ...product, price: Number(product.price) };
}

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async listHighlights({ category } = {}) {
    if (
      typeof category !== 'string' ||
      category.trim() === ''
    ) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A categoria é obrigatória.',
        { category: PRODUCT_CATEGORIES },
      );
    }

    const normalizedCategory = normalizeCategory(category);

    if (!PRODUCT_CATEGORIES.includes(normalizedCategory)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A categoria deve ser agricultura ou artesanato.',
        { category: PRODUCT_CATEGORIES },
      );
    }

    const items = (
      await this.productRepository.listActiveHighlights(
        PRODUCT_CATEGORY_TO_DB[normalizedCategory],
      )
    ).map(toProductResponse);

    return {
      items,
      category: normalizedCategory,
      limit: 3,
    };
  }

  async list({ page: rawPage, limit: rawLimit, category: rawCategory } = {}) {
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

    let pageSize = PRODUCT_PAGE_SIZE;

    if (rawLimit !== undefined) {
      const limitValue = String(rawLimit).trim();

      if (
        Array.isArray(rawLimit) ||
        !/^[1-9]\d*$/.test(limitValue) ||
        Number(limitValue) > MAX_PAGE_SIZE
      ) {
        throw new AppError(
          400,
          'VALIDATION_ERROR',
          `O limite deve ser um inteiro entre 1 e ${MAX_PAGE_SIZE}.`,
        );
      }

      pageSize = Number(limitValue);
    }

    let category;

    if (rawCategory !== undefined) {
      const normalizedCategory =
        typeof rawCategory === 'string'
          ? normalizeCategory(rawCategory)
          : null;

      if (!PRODUCT_CATEGORIES.includes(normalizedCategory)) {
        throw new AppError(
          400,
          'VALIDATION_ERROR',
          'A categoria deve ser agricultura ou artesanato.',
          { category: PRODUCT_CATEGORIES },
        );
      }

      category = PRODUCT_CATEGORY_TO_DB[normalizedCategory];
    }

    const skip = (page - 1) * pageSize;

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
        take: pageSize,
        ...(category && { category }),
      });

    return {
      items: items.map(toProductResponse),
      pagination: {
        page,
        limit: pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  // Painel admin: todos os produtos (ativos e inativos).
  async listAll() {
    const products = await this.productRepository.listAll();

    return products.map(toProductResponse);
  }

  async create(data = {}) {
    const {
      title,
      description,
      category,
      imageUrl,
      active,
      price,
      images,
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

    const normalizedTitle = title.trim();
    const normalizedCategory = normalizeCategory(category);

    if (!PRODUCT_CATEGORIES.includes(normalizedCategory)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A categoria deve ser agricultura ou artesanato.',
        { category: PRODUCT_CATEGORIES },
      );
    }

    const normalizedPrice = validatePrice(price);
    const imageUrls = validateProductImages(images);

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
      return toProductResponse(
        await this.productRepository.create({
          title: normalizedTitle,
          description:
            typeof description === 'string'
              ? description.trim() || null
              : null,
          category: PRODUCT_CATEGORY_TO_DB[normalizedCategory],
          price: normalizedPrice,
          imageUrl:
            imageUrls?.[0] ??
            (typeof imageUrl === 'string'
              ? imageUrl.trim() || null
              : null),
          ...(imageUrls && { images: imageUrls }),
          active: active ?? true,
        }),
      );
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
      return toProductResponse(product);
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

    return toProductResponse(inactiveProduct);
  }

  // "Excluir" produto: remove de vez. Para só esconder do site use inactivate.
  async remove(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O identificador do produto é inválido.',
      );
    }

    const removed = await this.productRepository.remove(id);

    if (!removed) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        'Produto não encontrado.',
      );
    }
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
      return toProductResponse(product);
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

    return toProductResponse(activeProduct);
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
      price,
      images,
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

    const normalizedTitle = title.trim();
    const normalizedCategory = normalizeCategory(category);

    if (!PRODUCT_CATEGORIES.includes(normalizedCategory)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'A categoria deve ser agricultura ou artesanato.',
        { category: PRODUCT_CATEGORIES },
      );
    }

    const normalizedPrice = validatePrice(price);
    const imageUrls = validateProductImages(images);

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
          category: PRODUCT_CATEGORY_TO_DB[normalizedCategory],
          price: normalizedPrice,
          imageUrl:
            imageUrls?.[0] ??
            (typeof imageUrl === 'string'
              ? imageUrl.trim() || null
              : null),
          ...(imageUrls && { images: imageUrls }),
        });

      if (!updatedProduct) {
        throw new AppError(
          404,
          'PRODUCT_NOT_FOUND',
          'Produto não encontrado.',
        );
      }

      return toProductResponse(updatedProduct);
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
