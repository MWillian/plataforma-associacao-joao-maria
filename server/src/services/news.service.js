import { AppError } from '../utils/app-error.js';
<<<<<<< HEAD

const AREAS = ['STUDIO', 'CRAFTS', 'AGRICULTURE'];
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
=======
import { throwValidation, validateImages } from '../utils/images.js';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MAX_NEWS_IMAGES = 10;

// Valores usados pelo front (studio | crafts | agriculture).
const AREA_TO_DB = {
  studio: 'STUDIO',
  crafts: 'CRAFTS',
  agriculture: 'AGRICULTURE',
};

function validateNewsData(data) {
  const fields = {};

  const title =
    typeof data.title === 'string' ? data.title.trim() : '';

  if (!title) {
    fields.title = 'O título da notícia é obrigatório.';
  }

  let description = null;

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      fields.description = 'A descrição deve ser um texto.';
    } else {
      description = data.description.trim() || null;
    }
  }

  const area =
    typeof data.publicationArea === 'string'
      ? AREA_TO_DB[data.publicationArea.trim().toLowerCase()]
      : undefined;

  if (!area) {
    fields.publicationArea =
      'Escolha onde publicar: studio, crafts ou agriculture.';
  }

  const images = validateImages(
    data.images,
    { max: MAX_NEWS_IMAGES },
    fields,
  );

  throwValidation(fields, 'Dados da notícia inválidos.');

  return {
    title,
    description,
    publicationArea: area,
    ...(images && { images }),
  };
}

function assertValidId(id) {
  if (!UUID_PATTERN.test(id ?? '')) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'O identificador da notícia é inválido.',
    );
  }
}

function newsNotFound() {
  return new AppError(
    404,
    'NEWS_NOT_FOUND',
    'Notícia não encontrada.',
  );
}

// Formato que o front consome (images = lista de URLs).
function toNewsResponse(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    publicationArea: row.publicationArea.toLowerCase(),
    images: (row.images ?? []).map((image) => image.url),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
>>>>>>> origin/main
}

export class NewsService {
  constructor(newsRepository) {
    this.newsRepository = newsRepository;
  }

<<<<<<< HEAD
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
=======
  async list() {
    const rows = await this.newsRepository.listPublished();

    return rows.map(toNewsResponse);
  }

  async create(data = {}) {
    const created = await this.newsRepository.create(
      validateNewsData(data),
    );

    return toNewsResponse(created);
  }

  // PUT: substitui título, descrição e área. As imagens só mudam se
  // `images` for enviado. Notícia despublicada não pode ser editada.
  async update(id, data = {}) {
    assertValidId(id);

    const validated = validateNewsData(data);
    const existing = await this.newsRepository.findById(id);

    if (!existing || !existing.published) {
      throw newsNotFound();
    }

    const updated = await this.newsRepository.update(id, validated);

    if (!updated) {
      throw newsNotFound();
    }

    return toNewsResponse(updated);
  }

  // "Excluir" notícia = despublicar (soft delete).
  async unpublish(id) {
    assertValidId(id);

    const existing = await this.newsRepository.findById(id);

    if (!existing) {
      throw newsNotFound();
    }

    if (!existing.published) {
      return toNewsResponse(existing);
    }

    const unpublished = await this.newsRepository.unpublish(id);

    if (!unpublished) {
      throw newsNotFound();
    }

    return toNewsResponse(unpublished);
>>>>>>> origin/main
  }
}
