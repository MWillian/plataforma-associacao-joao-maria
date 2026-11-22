import { prisma } from '../lib/prisma.js';

const STUDENT_INCLUDE = {
  guardians: { include: { guardian: true } },
  enrollments: { where: { status: 'ACTIVE' } },
};

// Operações simples sobre o banco. A regra de negócio fica no service,
// que as combina dentro de uma transação (`transaction`).
export class StudentRepository {
  constructor(client = prisma) {
    this.client = client;
  }

  // Executa o callback com um repository ligado à transação.
  transaction(callback) {
    return this.client.$transaction((tx) =>
      callback(new StudentRepository(tx)),
    );
  }

  findById(id) {
    return this.client.student.findUnique({
      where: { id },
      include: STUDENT_INCLUDE,
    });
  }

  // Alunos ativos, na ordem em que foram cadastrados.
  listActive() {
    return this.client.student.findMany({
      where: { active: true },
      include: STUDENT_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  listActiveByClass(classId) {
    return this.client.student.findMany({
      where: {
        active: true,
        enrollments: { some: { classId, status: 'ACTIVE' } },
      },
      include: STUDENT_INCLUDE,
      orderBy: { createdAt: 'asc' },
    });
  }

  findActiveClassById(id) {
    return this.client.class.findFirst({
      where: { id, active: true },
    });
  }

  async lockClassById(classId) {
    if (typeof this.client.$executeRaw !== 'function') {
      return;
    }

    await this.client.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtext(${classId}::text))
    `;
  }

  countActiveEnrollments(classId) {
    return this.client.enrollment.count({
      where: { classId, status: 'ACTIVE' },
    });
  }

  findGuardianByEmail(email) {
    return this.client.guardian.findUnique({ where: { email } });
  }

  createGuardian({ name, email, phone }) {
    return this.client.guardian.create({ data: { name, email, phone } });
  }

  updateGuardianName(id, name) {
    return this.client.guardian.update({
      where: { id },
      data: { name },
    });
  }

  updateGuardian(id, data) {
    return this.client.guardian.update({
      where: { id },
      data,
    });
  }

  createStudent(data) {
    return this.client.student.create({ data });
  }

  async updateStudent(id, data) {
    try {
      return await this.client.student.update({
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

  inactivateStudent(id) {
    return this.updateStudent(id, { active: false });
  }

  // Substitui o responsável do aluno (null = sem responsável).
  async setGuardian(studentId, guardianId) {
    await this.client.studentGuardian.deleteMany({
      where: { studentId },
    });

    if (guardianId) {
      await this.client.studentGuardian.create({
        data: { studentId, guardianId },
      });
    }
  }

  // Deixa a matrícula do aluno ativa somente nesta turma.
  async setActiveEnrollment(studentId, classId) {
    await this.client.enrollment.updateMany({
      where: {
        studentId,
        status: 'ACTIVE',
        classId: { not: classId },
      },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });

    await this.client.enrollment.upsert({
      where: { studentId_classId: { studentId, classId } },
      update: { status: 'ACTIVE', canceledAt: null },
      create: { studentId, classId },
    });
  }

  async addActiveEnrollment(studentId, classId) {
    await this.client.enrollment.upsert({
      where: { studentId_classId: { studentId, classId } },
      update: { status: 'ACTIVE', canceledAt: null },
      create: { studentId, classId },
    });
  }

  async setActiveEnrollments(studentId, classIds) {
    await this.client.enrollment.updateMany({
      where: {
        studentId,
        status: 'ACTIVE',
        classId: { notIn: classIds },
      },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });

    for (const classId of classIds) {
      await this.client.enrollment.upsert({
        where: { studentId_classId: { studentId, classId } },
        update: { status: 'ACTIVE', canceledAt: null },
        create: { studentId, classId },
      });
    }
  }

  async cancelEnrollment(studentId, classId) {
    await this.client.enrollment.updateMany({
      where: { studentId, classId, status: 'ACTIVE' },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });
  }

  async cancelActiveEnrollments(studentId) {
    await this.client.enrollment.updateMany({
      where: { studentId, status: 'ACTIVE' },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });
  }
}
