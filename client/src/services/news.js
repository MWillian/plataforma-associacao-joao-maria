import { api } from './api.js';
import { uploadImageToCloudinary } from './media.js';

// A API devolve createdAt; o front exibe a data em dd/mm/aaaa.
export function newsFromApi(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    images: row.images ?? [],
    publicationArea: row.publicationArea,
    createdAt: row.createdAt,
    date: new Date(row.createdAt).toLocaleDateString('pt-BR'),
  };
}

async function toPayload(news) {
  const images = [];

  for (const image of news.images ?? []) {
    const uploadedImage = await uploadImageToCloudinary(image, 'news');

    if (uploadedImage?.url) {
      images.push(uploadedImage.url);
    }
  }

  return {
    title: news.title,
    description: news.description,
    images,
    publicationArea: news.publicationArea,
  };
}

// Público: Home, murais e detalhe.
export async function listNews() {
  const { data } = await api.get('/news');
  return data.map(newsFromApi);
}

export async function createNews(news) {
  const { data } = await api.post('/news', await toPayload(news));
  return newsFromApi(data);
}

export async function updateNews(id, news) {
  const { data } = await api.put(`/news/${id}`, await toPayload(news));
  return newsFromApi(data);
}

// "Excluir" notícia = despublicar no backend.
export async function removeNews(id) {
  await api.patch(`/news/${id}/unpublish`);
}
