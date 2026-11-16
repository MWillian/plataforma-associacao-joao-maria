const AREA_TO_API = {
  studio: 'STUDIO',
  crafts: 'CRAFTS',
  agriculture: 'AGRICULTURE',
};

const AREA_FROM_API = {
  STUDIO: 'studio',
  CRAFTS: 'crafts',
  AGRICULTURE: 'agriculture',
};

function getImageUrls(images = []) {
  return images
    .map((image) => (
      typeof image === 'string' ? image : image?.url
    ))
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('pt-BR');
}

export function newsToApi(news) {
  return {
    title: news.title?.trim(),
    description: news.description?.trim() || null,
    publicationArea:
      AREA_TO_API[news.publicationArea] ||
      news.publicationArea,
    published: news.published ?? true,
    images: getImageUrls(news.images),
  };
}

export function newsFromApi(news, fallback = {}) {
  const images = getImageUrls(news.images);

  return {
    ...fallback,
    id: news.id ?? fallback.id,
    title: news.title ?? fallback.title ?? '',
    description: news.description ?? fallback.description ?? '',
    publicationArea:
      AREA_FROM_API[news.publicationArea] ||
      fallback.publicationArea ||
      news.publicationArea,
    published: news.published ?? fallback.published ?? true,
    createdAt: news.createdAt ?? fallback.createdAt,
    updatedAt: news.updatedAt ?? fallback.updatedAt,
    date: formatDate(news.createdAt ?? fallback.createdAt),
    images: images.length
      ? images.map((url) => ({ url }))
      : fallback.images || [],
  };
}
