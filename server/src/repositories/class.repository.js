import { prisma } from '../lib/prisma.js';

export class ClassRepository {
  async create(data) {
    return prisma.class.create({
      data,
    });
  }

  async update(id, data) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          SELECT pg_advisory_xact_lock(hashtext(${id}::text))
        `;

        if (data.capacity !== null && data.capacity !== undefined) {
          const activeStudents = await tx.enrollment.count({
            where: { classId: id, status: 'ACTIVE' },
          });

          if (data.capacity < activeStudents) {
            const error = new Error(
              `A capacidade não pode ser menor que o número atual de ${activeStudents} aluno(s) matriculado(s).`,
            );
            error.code = 'CLASS_CAPACITY_BELOW_STUDENT_COUNT';
            throw error;
          }
        }

        return tx.class.update({
          where: { id },
          data,
        });
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  // Turma ativa com o mesmo nome, sem diferenciar maiúsculas/minúsculas.
  async findActiveByName(name) {
    return prisma.class.findFirst({
      where: {
        active: true,
        name: { equals: name, mode: 'insensitive' },
      },
    });
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

  async countActiveEnrollments(id) {
    return prisma.enrollment.count({
      where: { classId: id, status: 'ACTIVE' },
    });
  }

  async lockClassById(id) {
    await prisma.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtext(${id}::text))
    `;
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
          await tx.enrollment.updateMany({
            where: {
              studentId: { in: studentIds },
              classId: id,
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
