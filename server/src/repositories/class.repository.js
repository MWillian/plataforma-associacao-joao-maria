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

  // The foreign keys cascade to enrollment and notice-class relations.
  async remove(id) {
    try {
      return await prisma.class.delete({ where: { id } });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }
}
