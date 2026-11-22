import { prisma } from '../lib/prisma.js';

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
    return prisma.notice.findUnique({
      where: { id },
      include: NOTICE_INCLUDE,
    });
  }

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
      throw error;
    }
  }
}
