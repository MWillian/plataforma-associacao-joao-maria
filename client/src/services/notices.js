import { api } from './api.js';
import { noticeFromApi, noticeToApi } from './noticeMapper.js';

export async function listNotices() {
  const { data } = await api.get('/notices');
  return data.map((item) => noticeFromApi(item));
}

export async function createNotice(notice) {
  const { data } = await api.post('/notices', noticeToApi(notice));
  return noticeFromApi(data);
}

export async function sendNotice(id) {
  const { data } = await api.post(`/notices/${id}/send`);
  return noticeFromApi(data);
}

export async function removeNotice(id) {
  await api.delete(`/notices/${id}`);
}
