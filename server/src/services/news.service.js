import { AppError } from '../utils/app-error.js';
import {
  getCloudinaryPublicIdFromUrl,
  throwValidation,
  validateImages,
} from '../utils/images.js';
import { deleteCloudinaryImages } from './media.service.js';

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
    { max: MAX_NEWS_IMAGES, folder: 'news' },
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
}

export class NewsService {
  constructor(newsRepository, mediaService) {
    this.newsRepository = newsRepository;
    this.mediaService = mediaService;
  }

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
  // `images` for enviado.
  async update(id, data = {}) {
    assertValidId(id);

    const validated = validateNewsData(data);
    const existing = await this.newsRepository.findById(id);

    if (!existing || !existing.published) {
      throw newsNotFound();
    }

    if (validated.images) {
      const nextPublicIds = new Set(
        validated.images.map((image) => image.publicId).filter(Boolean),
      );
      const removedImages = (existing.images ?? []).filter((image) => {
        const publicId =
          image.publicId ??
          getCloudinaryPublicIdFromUrl(image.url, 'news');

        return !publicId || !nextPublicIds.has(publicId);
      });

      await deleteCloudinaryImages(
        this.mediaService,
        removedImages,
        'news',
      );
    }

    const updated = await this.newsRepository.update(id, validated);

    if (!updated) {
      throw newsNotFound();
    }

    return toNewsResponse(updated);
  }

  async remove(id) {
    assertValidId(id);

    const existing = await this.newsRepository.findById(id);

    if (!existing) {
      throw newsNotFound();
    }

    await deleteCloudinaryImages(
      this.mediaService,
      existing.images,
      'news',
    );
    const removed = await this.newsRepository.remove(id);

    if (!removed) {
      throw newsNotFound();
    }

    return toNewsResponse(removed);
  }
}
