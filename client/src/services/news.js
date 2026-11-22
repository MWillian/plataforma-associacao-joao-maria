import { api } from './api.js';
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
  return newsFromApi(data);
}

export async function updateNews(id, news) {
  const { data } = await api.put(`/news/${id}`, newsToApi(news));
  return newsFromApi(data);
}

export async function removeNews(id) {
  const { data } = await api.patch(`/news/${id}/inactivate`);
  return newsFromApi(data);
}
