import { api } from './api.js';
<<<<<<< HEAD
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
=======

export function noticeFromApi(row) {
  return {
    id: row.id,
    classIds: row.danceClassIds,
    subject: row.subject,
    type: row.type,
    message: row.message,
    date: new Date(row.createdAt).toLocaleDateString('pt-BR'),
    totalRecipients: row.totalRecipients,
    sentCount: row.sentCount,
    skippedCount: row.skippedCount,
    failedCount: row.failedCount,
  };
}

export async function listNotices() {
  const { data } = await api.get('/notices');
  return data.map(noticeFromApi);
}

// Cria o aviso e dispara o e-mail para os responsáveis/alunos das turmas.
export async function createNotice({ classIds, subject, type, message }) {
  const { data } = await api.post('/notices', {
    danceClassIds: classIds,
    subject,
    type,
    message,
  });
>>>>>>> origin/main
  return noticeFromApi(data);
}

export async function removeNotice(id) {
  await api.delete(`/notices/${id}`);
}
