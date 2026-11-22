import { api } from './api.js';
<<<<<<< HEAD
import { newsFromApi, newsToApi } from './newsMapper.js';

export async function listNews({ publicationArea, page = 1, includeInactive = false } = {}) {
  const { data } = await api.get('/news', {
    params: {
      ...(publicationArea ? { publicationArea } : {}),
      page,
      includeInactive,
    },
  });
  return {
    ...data,
    items: (data.items ?? []).map((item) => newsFromApi(item)),
  };
}

export async function listNewsHighlights(publicationArea) {
  const { data } = await api.get('/news/highlights', {
    params: { publicationArea },
  });
  return (data.items ?? []).map((item) => newsFromApi(item));
}

export async function getNews(id) {
  const { data } = await api.get(`/news/${id}`);
  return newsFromApi(data);
}

export async function createNews(news) {
  const { data } = await api.post('/news', newsToApi(news));
=======

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
>>>>>>> origin/main
  return newsFromApi(data);
}

export async function updateNews(id, news) {
<<<<<<< HEAD
  const { data } = await api.put(`/news/${id}`, newsToApi(news));
  return newsFromApi(data);
}

export async function removeNews(id) {
  const { data } = await api.patch(`/news/${id}/inactivate`);
  return newsFromApi(data);
=======
  const { data } = await api.put(`/news/${id}`, toPayload(news));
  return newsFromApi(data);
}

// "Excluir" notícia = despublicar no backend.
export async function removeNews(id) {
  await api.patch(`/news/${id}/unpublish`);
>>>>>>> origin/main
}
