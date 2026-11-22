import { api } from './api.js';

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
  return noticeFromApi(data);
}

export async function removeNotice(id) {
  await api.delete(`/notices/${id}`);
}
