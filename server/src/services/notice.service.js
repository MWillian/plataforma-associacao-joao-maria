import { AppError } from '../utils/app-error.js';
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
  }
}
