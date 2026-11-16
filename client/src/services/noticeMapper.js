const TYPE_TO_API = {
  Informativo: 'INFORMATION',
  Cancelamento: 'CANCELLATION',
};

const TYPE_FROM_API = {
  INFORMATION: 'Informativo',
  CANCELLATION: 'Cancelamento',
};

function getClassIds(notice) {
  if (Array.isArray(notice.classIds)) {
    return notice.classIds;
  }

  if (notice.classId !== undefined && notice.classId !== null) {
    return [notice.classId];
  }

  return [];
}

export function noticeToApi(notice) {
  return {
    type: TYPE_TO_API[notice.type] || notice.type,
    subject: notice.subject?.trim(),
    message: notice.message?.trim(),
    classIds: getClassIds(notice),
  };
}

export function noticeFromApi(notice, fallback = {}) {
  const classIds = notice.classIds ||
    notice.classes?.map((item) => item.classId ?? item.id) ||
    getClassIds(fallback);

  return {
    ...fallback,
    id: notice.id ?? fallback.id,
    type:
      TYPE_FROM_API[notice.type] ||
      fallback.type ||
      notice.type,
    subject: notice.subject ?? fallback.subject ?? '',
    message: notice.message ?? fallback.message ?? '',
    classIds,
    createdAt: notice.createdAt ?? fallback.createdAt,
    sentAt: notice.sentAt ?? fallback.sentAt,
    status: notice.status ?? fallback.status,
    totalRecipients:
      notice.totalRecipients ?? fallback.totalRecipients ?? 0,
    sentCount: notice.sentCount ?? fallback.sentCount ?? 0,
    skippedCount:
      notice.skippedCount ?? fallback.skippedCount ?? 0,
    failedCount:
      notice.failedCount ?? fallback.failedCount ?? 0,
    date: notice.createdAt
      ? new Date(notice.createdAt).toLocaleDateString('pt-BR')
      : fallback.date,
  };
}
