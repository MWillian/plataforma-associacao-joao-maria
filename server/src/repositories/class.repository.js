import { prisma } from '../lib/prisma.js';

export class ClassRepository {
  async create(data) {
    return prisma.class.create({
      data,
    });
  }

  async update(id, data) {
    try {
      return await prisma.class.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  async findById(id) {
    return prisma.class.findUnique({
      where: { id },
    });
  }

  // Turmas ativas, na ordem em que foram cadastradas.
  async listActive() {
    return prisma.class.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Inativa a turma e, como o front faz ao excluir uma turma, também
  // inativa os alunos matriculados nela e cancela essas matrículas.
  async inactivate(id) {
    try {
      return await prisma.$transaction(async (tx) => {
        const danceClass = await tx.class.update({
          where: { id },
          data: { active: false },
        });

        const enrollments = await tx.enrollment.findMany({
          where: { classId: id, status: 'ACTIVE' },
          select: { studentId: true },
        });

        const studentIds = enrollments.map(
          (enrollment) => enrollment.studentId,
        );

        if (studentIds.length > 0) {
          await tx.student.updateMany({
            where: { id: { in: studentIds } },
            data: { active: false },
          });

          await tx.enrollment.updateMany({
            where: {
              studentId: { in: studentIds },
              status: 'ACTIVE',
            },
            data: { status: 'CANCELED', canceledAt: new Date() },
          });
        }

        return danceClass;
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }
}
