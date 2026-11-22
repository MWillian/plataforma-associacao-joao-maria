import { AppError } from '../utils/app-error.js';
<<<<<<< HEAD
import { sendNoticeEmail } from './email.service.js';

const TYPES = ['INFORMATION', 'CANCELLATION'];
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class NoticeService {
  constructor(noticeRepository) {
    this.noticeRepository = noticeRepository;
  }

  async list() {
    return this.noticeRepository.list();
  }

  async create(senderId, data = {}) {
    const type = String(data.type ?? '').trim().toUpperCase();
    const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    const classIds = Array.isArray(data.classIds)
      ? [...new Set(data.classIds)]
      : [];

    if (!TYPES.includes(type)) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Tipo de aviso inválido.');
    }
    if (!subject) throw new AppError(400, 'VALIDATION_ERROR', 'O assunto é obrigatório.');
    if (!message) throw new AppError(400, 'VALIDATION_ERROR', 'A mensagem é obrigatória.');
    if (classIds.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Selecione pelo menos uma turma.');
    }
    if (!classIds.every((id) => UUID_PATTERN.test(id))) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Uma das turmas é inválida.');
    }

    const activeClasses = await this.noticeRepository.findActiveClasses(classIds);
    if (activeClasses.length !== classIds.length) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Uma das turmas não está ativa.');
    }

    return this.noticeRepository.create({
      senderId,
      type,
      subject,
      message,
      classIds,
    });
  }

  async send(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Identificador inválido.');
    }

    const notice = await this.noticeRepository.findById(id);
    if (!notice) throw new AppError(404, 'NOTICE_NOT_FOUND', 'Aviso não encontrado.');
    if (notice.sentAt) return notice;

    const classIds = notice.classes.map((item) => item.classId);
    const students = await this.noticeRepository.findRecipients(classIds);
    const recipientsByEmail = new Map();
    let skippedCount = 0;

    for (const student of students) {
      const guardian = student.guardians?.[0]?.guardian;
      const email = guardian?.email || student.email;

      if (!email) {
        skippedCount += 1;
        continue;
      }

      recipientsByEmail.set(email.toLowerCase(), {
        studentId: student.id,
        guardianId: guardian?.id ?? null,
        email: email.toLowerCase(),
        name: guardian?.name || student.name,
      });
    }

    let prepared = await this.noticeRepository.replaceRecipients(
      id,
      [...recipientsByEmail.values()],
    );

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of prepared.recipients) {
      try {
        await sendNoticeEmail({
          email: recipient.email,
          subject: notice.subject,
          message: notice.message,
        });
        await this.noticeRepository.updateRecipient(id, recipient.id, {
          status: 'SENT',
          sentAt: new Date(),
        });
        sentCount += 1;
      } catch (error) {
        await this.noticeRepository.updateRecipient(id, recipient.id, {
          status: 'FAILED',
          failureReason: error.message,
        });
        failedCount += 1;
      }
    }

    prepared = await this.noticeRepository.updateCounters(id, {
      sentAt: new Date(),
      sentCount,
      skippedCount,
      failedCount,
    });

    return prepared;
  }

  async remove(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Identificador inválido.');
    }
    const removed = await this.noticeRepository.remove(id);
    if (!removed) throw new AppError(404, 'NOTICE_NOT_FOUND', 'Aviso não encontrado.');
=======
import { throwValidation } from '../utils/images.js';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Rótulos usados pelo front <-> enum do banco.
const TYPE_TO_DB = {
  Informativo: 'INFORMATION',
  Cancelamento: 'CANCELLATION',
};

const TYPE_FROM_DB = {
  INFORMATION: 'Informativo',
  CANCELLATION: 'Cancelamento',
};

const SEND_BATCH_SIZE = 5;

function validateNoticeData(data) {
  const fields = {};

  const subject =
    typeof data.subject === 'string' ? data.subject.trim() : '';

  if (!subject) {
    fields.subject = 'O assunto do aviso é obrigatório.';
  }

  const message =
    typeof data.message === 'string' ? data.message.trim() : '';

  if (!message) {
    fields.message = 'A mensagem do aviso é obrigatória.';
  }

  const type = TYPE_TO_DB[data.type];

  if (!type) {
    fields.type = 'O tipo deve ser Informativo ou Cancelamento.';
  }

  let classIds = [];

  if (
    !Array.isArray(data.danceClassIds) ||
    data.danceClassIds.length === 0
  ) {
    fields.danceClassIds = 'Selecione pelo menos uma turma.';
  } else if (
    !data.danceClassIds.every(
      (id) => typeof id === 'string' && UUID_PATTERN.test(id),
    )
  ) {
    fields.danceClassIds = 'Turma inválida.';
  } else {
    classIds = [...new Set(data.danceClassIds)];
  }

  throwValidation(fields, 'Dados do aviso inválidos.');

  return { subject, message, type, classIds };
}

// Define para quem o e-mail vai: responsável (aluno menor) ou o próprio
// aluno. Quem não tem e-mail é contado como "sem e-mail" (skipped).
function buildRecipients(students) {
  const byEmail = new Map();
  let skipped = 0;

  for (const student of students) {
    const guardian = student.isMinor
      ? student.guardians?.find((link) => link.guardian?.email)?.guardian
      : null;

    const email = guardian?.email ?? student.email;

    if (!email) {
      skipped += 1;
      continue;
    }

    if (!byEmail.has(email)) {
      byEmail.set(email, {
        studentId: student.id,
        guardianId: guardian?.id ?? null,
        email,
        name: guardian?.name ?? student.name,
      });
    }
  }

  return { recipients: [...byEmail.values()], skipped };
}

function toNoticeResponse(row) {
  return {
    id: row.id,
    danceClassIds: (row.classes ?? []).map((link) => link.classId),
    subject: row.subject,
    type: TYPE_FROM_DB[row.type],
    message: row.message,
    createdAt: row.createdAt,
    totalRecipients: row.totalRecipients,
    sentCount: row.sentCount,
    skippedCount: row.skippedCount,
    failedCount: row.failedCount,
  };
}

export class NoticeService {
  constructor(noticeRepository, { sendEmail, isEmailConfigured }) {
    this.noticeRepository = noticeRepository;
    this.sendEmail = sendEmail;
    this.isEmailConfigured = isEmailConfigured;
  }

  // Cria o aviso e envia o e-mail para os responsáveis/alunos das turmas.
  async create(senderId, data = {}) {
    const { subject, message, type, classIds } =
      validateNoticeData(data);

    const classes = await this.noticeRepository.findActiveClasses(classIds);

    if (classes.length !== classIds.length) {
      throwValidation(
        { danceClassIds: 'Uma ou mais turmas não foram encontradas.' },
        'Dados do aviso inválidos.',
      );
    }

    const students =
      await this.noticeRepository.findStudentsOfClasses(classIds);
    const { recipients, skipped } = buildRecipients(students);

    const notice = await this.noticeRepository.create({
      type,
      subject,
      message,
      senderId,
      classIds,
      totalRecipients: recipients.length,
      skippedCount: skipped,
      recipients,
    });

    const results = await this.deliver(notice, { subject, message });
    const finished = await this.noticeRepository.saveDelivery(
      notice.id,
      results,
    );

    return toNoticeResponse(finished);
  }

  async deliver(notice, { subject, message }) {
    if (!this.isEmailConfigured()) {
      return notice.recipients.map((recipient) => ({
        recipientId: recipient.id,
        status: 'FAILED',
        failureReason: 'Envio de e-mail não configurado no servidor.',
      }));
    }

    const results = [];

    for (let i = 0; i < notice.recipients.length; i += SEND_BATCH_SIZE) {
      const batch = notice.recipients.slice(i, i + SEND_BATCH_SIZE);

      const settled = await Promise.allSettled(
        batch.map((recipient) =>
          this.sendEmail({ email: recipient.email, subject, message }),
        ),
      );

      settled.forEach((outcome, index) => {
        results.push(
          outcome.status === 'fulfilled'
            ? { recipientId: batch[index].id, status: 'SENT' }
            : {
                recipientId: batch[index].id,
                status: 'FAILED',
                failureReason: String(
                  outcome.reason?.message ?? outcome.reason,
                ).slice(0, 500),
              },
        );
      });
    }

    return results;
  }

  async list() {
    const rows = await this.noticeRepository.listActive();

    return rows.map(toNoticeResponse);
  }

  // "Excluir" aviso = arquivar: some da lista, mas o histórico de envio fica.
  async remove(id) {
    if (!UUID_PATTERN.test(id ?? '')) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'O identificador do aviso é inválido.',
      );
    }

    const notice = await this.noticeRepository.findById(id);

    if (!notice || notice.archivedAt) {
      throw new AppError(404, 'NOTICE_NOT_FOUND', 'Aviso não encontrado.');
    }

    const archived = await this.noticeRepository.archive(id);

    if (!archived) {
      throw new AppError(404, 'NOTICE_NOT_FOUND', 'Aviso não encontrado.');
    }

    return toNoticeResponse(archived);
>>>>>>> origin/main
  }
}
