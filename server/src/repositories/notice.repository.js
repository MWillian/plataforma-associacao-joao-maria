import { prisma } from '../lib/prisma.js';

<<<<<<< HEAD
const NOTICE_INCLUDE = {
  classes: { include: { class: true } },
  recipients: true,
};

export class NoticeRepository {
  list() {
    return prisma.notice.findMany({
      include: NOTICE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id) {
=======
const NOTICE_INCLUDE = { classes: true };

export class NoticeRepository {
  async findActiveClasses(ids) {
    return prisma.class.findMany({
      where: { id: { in: ids }, active: true },
      select: { id: true },
    });
  }

  // Alunos ativos com matrícula ativa em alguma das turmas.
  async findStudentsOfClasses(classIds) {
    return prisma.student.findMany({
      where: {
        active: true,
        enrollments: {
          some: { classId: { in: classIds }, status: 'ACTIVE' },
        },
      },
      include: { guardians: { include: { guardian: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create({ recipients, classIds, ...data }) {
    return prisma.notice.create({
      data: {
        ...data,
        classes: {
          create: classIds.map((classId) => ({ classId })),
        },
        recipients: {
          create: recipients,
        },
      },
      include: { classes: true, recipients: true },
    });
  }

  // Grava o resultado do envio de cada destinatário e os totais do aviso.
  async saveDelivery(noticeId, results) {
    const sentCount = results.filter((r) => r.status === 'SENT').length;
    const failedCount = results.filter((r) => r.status === 'FAILED').length;

    return prisma.$transaction(async (tx) => {
      for (const result of results) {
        await tx.noticeRecipient.update({
          where: { id: result.recipientId },
          data: {
            status: result.status,
            failureReason: result.failureReason ?? null,
            sentAt: result.status === 'SENT' ? new Date() : null,
          },
        });
      }

      return tx.notice.update({
        where: { id: noticeId },
        data: { sentAt: new Date(), sentCount, failedCount },
        include: NOTICE_INCLUDE,
      });
    });
  }

  async listActive() {
    return prisma.notice.findMany({
      where: { archivedAt: null },
      include: NOTICE_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findById(id) {
>>>>>>> origin/main
    return prisma.notice.findUnique({
      where: { id },
      include: NOTICE_INCLUDE,
    });
  }

<<<<<<< HEAD
  findActiveClasses(classIds) {
    return prisma.class.findMany({
      where: { id: { in: classIds }, active: true },
      select: { id: true },
    });
  }

  async create({ senderId, type, subject, message, classIds }) {
    return prisma.notice.create({
      data: {
        senderId,
        type,
        subject,
        message,
        classes: {
          create: classIds.map((classId) => ({ classId })),
        },
      },
      include: NOTICE_INCLUDE,
    });
  }

  findRecipients(classIds) {
    return prisma.student.findMany({
      where: {
        active: true,
        enrollments: {
          some: {
            classId: { in: classIds },
            status: 'ACTIVE',
          },
        },
      },
      include: {
        guardians: {
          include: { guardian: true },
        },
      },
    });
  }

  replaceRecipients(noticeId, recipients) {
    return prisma.$transaction(async (tx) => {
      await tx.noticeRecipient.deleteMany({ where: { noticeId } });
      if (recipients.length > 0) {
        await tx.noticeRecipient.createMany({
          data: recipients.map((recipient) => ({
            noticeId,
            studentId: recipient.studentId,
            guardianId: recipient.guardianId,
            email: recipient.email,
            name: recipient.name,
            status: 'PENDING',
          })),
        });
      }

      return tx.notice.update({
        where: { id: noticeId },
        data: { totalRecipients: recipients.length },
        include: NOTICE_INCLUDE,
      });
    });
  }

  updateRecipient(noticeId, recipientId, data) {
    return prisma.noticeRecipient.update({
      where: { id: recipientId },
      data,
    });
  }

  updateCounters(noticeId, data) {
    return prisma.notice.update({
      where: { id: noticeId },
      data,
      include: NOTICE_INCLUDE,
    });
  }

  async remove(id) {
    try {
      await prisma.notice.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error?.code === 'P2025') return false;
=======
  async archive(id) {
    try {
      return await prisma.notice.update({
        where: { id },
        data: { archivedAt: new Date() },
        include: NOTICE_INCLUDE,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

>>>>>>> origin/main
      throw error;
    }
  }
}
