import { api } from './api.js';

// A API devolve createdAt; o front exibe a data em dd/mm/aaaa.
export function newsFromApi(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    images: row.images ?? [],
    publicationArea: row.publicationArea,
    date: new Date(row.createdAt).toLocaleDateString('pt-BR'),
  };
}

function toPayload(news) {
  return {
    title: news.title,
    description: news.description,
    images: news.images,
    publicationArea: news.publicationArea,
  };
}

// Público: Home, murais e detalhe.
export async function listNews() {
  const { data } = await api.get('/news');
  return data.map(newsFromApi);
}

export async function createNews(news) {
  const { data } = await api.post('/news', toPayload(news));
  return newsFromApi(data);
}

export async function updateNews(id, news) {
  const { data } = await api.put(`/news/${id}`, toPayload(news));
  return newsFromApi(data);
}

// "Excluir" notícia = despublicar no backend.
export async function removeNews(id) {
  await api.patch(`/news/${id}/unpublish`);
}
