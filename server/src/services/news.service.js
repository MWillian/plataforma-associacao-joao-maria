import { AppError } from '../utils/app-error.js';

const AREAS = ['STUDIO', 'CRAFTS', 'AGRICULTURE'];
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export class NewsService {
  constructor(newsRepository) {
    this.newsRepository = newsRepository;
  }

  async list({ publicationArea, page = '1', includeInactive = false } = {}) {
    let normalizedArea;
    if (publicationArea) {
      const area = String(publicationArea).trim().toUpperCase();
      if (!AREAS.includes(area)) {
        throw new AppError(400, 'VALIDATION_ERROR', 'Área de publicação inválida.');
      }
      normalizedArea = area;
    }

    if (!/^[1-9]\d*$/.test(String(page))) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Página inválida.');
    }

    const limit = 10;
    const pageNumber = Number(page);
    const [items, totalItems] = await this.newsRepository.list({
      publicationArea: normalizedArea,
      includeInactive: false,
      limit,
      skip: (pageNumber - 1) * limit,
    });

    return {
      items,
      pagination: {
        page: pageNumber,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async listHighlights({ publicationArea } = {}) {
    const area = String(publicationArea ?? '').trim().toUpperCase();
    if (!AREAS.includes(area)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Área de publicação obrigatória.');
    }
    const [items] = await this.newsRepository.list({
      publicationArea: area,
      limit: 3,
    });
    return { items, publicationArea: area, limit: 3 };
  }

  async findById(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Identificador inválido.');
    }
    const news = await this.newsRepository.findById(id);
    if (!news || !news.published) {
      throw new AppError(404, 'NEWS_NOT_FOUND', 'Notícia não encontrada.');
    }
    return news;
  }

  async create(data = {}) {
    const title = normalizeText(data.title);
    const publicationArea = String(data.publicationArea ?? '').trim().toUpperCase();

    if (!title) {
      throw new AppError(400, 'VALIDATION_ERROR', 'O título é obrigatório.');
    }
    if (!AREAS.includes(publicationArea)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Área de publicação inválida.');
    }

    const images = Array.isArray(data.images)
      ? data.images.filter((image) => typeof image === 'string' && image.trim()).map((image) => image.trim())
      : [];

    return this.newsRepository.create({
      title,
      description: normalizeText(data.description) || null,
      publicationArea,
      published: data.published ?? true,
      images,
    });
  }

  async update(id, data = {}) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Identificador inválido.');
    }
    const news = await this.newsRepository.findById(id);
    if (!news) throw new AppError(404, 'NEWS_NOT_FOUND', 'Notícia não encontrada.');

    const title = normalizeText(data.title);
    const publicationArea = String(data.publicationArea ?? '').trim().toUpperCase();
    if (!title) throw new AppError(400, 'VALIDATION_ERROR', 'O título é obrigatório.');
    if (!AREAS.includes(publicationArea)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Área de publicação inválida.');
    }

    const update = {
      title,
      description: normalizeText(data.description) || null,
      publicationArea,
      published: data.published ?? true,
    };
    if (Array.isArray(data.images)) {
      update.images = data.images
        .filter((image) => typeof image === 'string' && image.trim())
        .map((image) => image.trim());
    }

    return this.newsRepository.update(id, update);
  }

  async inactivate(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Identificador inválido.');
    }
    const news = await this.newsRepository.inactivate(id);
    if (!news) throw new AppError(404, 'NEWS_NOT_FOUND', 'Notícia não encontrada.');
    return news;
  }
}
