import { AppError } from '../utils/app-error.js';
import {
  normalizeEmail,
  normalizePhone,
} from '../utils/validators.js';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MEDICAL_FIELDS = [
  'allergies',
  'medicalConditions',
  'medications',
  'physicalRestrictions',
];

function isFilled(value) {
  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  return value !== undefined && value !== null;
}

function validateOptionalText(value, name, fields) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    fields[name] = 'Deve ser um texto.';
    return null;
  }

  return value.trim() || null;
}

function validationError(fields) {
  return new AppError(
    400,
    'VALIDATION_ERROR',
    'Dados do aluno inválidos.',
    fields,
  );
}

// Valida o corpo no formato enviado pelo formulário do front:
// name, email, phone, danceClassId, isMinor, guardian, guardianEmail
// e os quatro campos da ficha médica.
function validateStudentData(data) {
  const fields = {};

  const name =
    typeof data.name === 'string' ? data.name.trim() : '';

  if (!name) {
    fields.name = 'O nome do aluno é obrigatório.';
  }

  let email = null;

  if (isFilled(data.email)) {
    email = normalizeEmail(data.email);

    if (!email) {
      fields.email = 'E-mail inválido.';
    }
  }

  let phone = null;

  if (isFilled(data.phone)) {
    if (normalizePhone(data.phone)) {
      phone = data.phone.trim();
    } else {
      fields.phone = 'Telefone inválido. Informe DDD e número.';
    }
  }

  let danceClassId = null;

  if (!isFilled(data.danceClassId)) {
    fields.danceClassId = 'Selecione uma turma.';
  } else if (
    typeof data.danceClassId !== 'string' ||
    !UUID_PATTERN.test(data.danceClassId)
  ) {
    fields.danceClassId = 'Turma inválida.';
  } else {
    danceClassId = data.danceClassId;
  }

  if (
    data.isMinor !== undefined &&
    typeof data.isMinor !== 'boolean'
  ) {
    fields.isMinor = 'O campo isMinor deve ser booleano.';
  }

  const isMinor = data.isMinor === true;

  // Responsável: só vale para menor de idade (o front limpa os campos
  // quando o aluno deixa de ser menor).
  let guardian = null;

  if (isMinor) {
    const guardianName =
      typeof data.guardian === 'string' ? data.guardian.trim() : '';

    if (!guardianName) {
      fields.guardian = 'O nome do responsável é obrigatório.';
    }

    let guardianEmail = null;

    if (isFilled(data.guardianEmail)) {
      guardianEmail = normalizeEmail(data.guardianEmail);

      if (!guardianEmail) {
        fields.guardianEmail = 'E-mail do responsável inválido.';
      }
    }

    guardian = { name: guardianName, email: guardianEmail };
  }

  const medical = {};

  for (const field of MEDICAL_FIELDS) {
    medical[field] = validateOptionalText(
      data[field],
      field,
      fields,
    );
  }

  if (Object.keys(fields).length > 0) {
    throw validationError(fields);
  }

  return {
    student: { name, email, phone, isMinor, ...medical },
    danceClassId,
    guardian,
  };
}

function assertValidStudentId(id) {
  if (!UUID_PATTERN.test(id ?? '')) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'O identificador do aluno é inválido.',
    );
  }
}

function assertValidClassId(id) {
  if (!UUID_PATTERN.test(id ?? '')) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'O identificador da turma é inválido.',
    );
  }
}

function classNotFound() {
  return new AppError(
    404,
    'CLASS_NOT_FOUND',
    'Turma não encontrada.',
  );
}

function studentNotFound() {
  return new AppError(
    404,
    'STUDENT_NOT_FOUND',
    'Aluno não encontrado.',
  );
}

// Formato esperado pelo front: turma e responsável "achatados".
function toStudentResponse(row) {
  const guardian = row.guardians?.[0]?.guardian ?? null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    danceClassId: row.enrollments?.[0]?.classId ?? null,
    isMinor: row.isMinor,
    guardian: guardian?.name ?? null,
    guardianEmail: guardian?.email ?? null,
    allergies: row.allergies,
    medicalConditions: row.medicalConditions,
    medications: row.medications,
    physicalRestrictions: row.physicalRestrictions,
    active: row.active,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class StudentService {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async list() {
    const students = await this.studentRepository.listActive();

    return students.map(toStudentResponse);
  }

  // Alunos com matrícula ativa na turma.
  async listByClass(classId) {
    assertValidClassId(classId);

    const danceClass =
      await this.studentRepository.findActiveClassById(classId);

    if (!danceClass) {
      throw classNotFound();
    }

    const students =
      await this.studentRepository.listActiveByClass(classId);

    return students.map(toStudentResponse);
  }

  async create(data = {}) {
    const { student, danceClassId, guardian } =
      validateStudentData(data);

    return this.runInTransaction(async (repo) => {
      const danceClass = await this.findClassOrFail(
        repo,
        danceClassId,
      );

      await this.assertClassHasRoom(repo, danceClass);

      const created = await repo.createStudent(student);

      await this.syncGuardian(repo, created.id, guardian);
      await repo.setActiveEnrollment(created.id, danceClassId);

      return toStudentResponse(await repo.findById(created.id));
    });
  }

  // PUT: substitui os dados do aluno (campos opcionais omitidos são
  // limpos). Trocar `danceClassId` move o aluno de turma. Aluno inativo
  // (excluído) não pode ser editado.
  async update(id, data = {}) {
    assertValidStudentId(id);

    const { student, danceClassId, guardian } =
      validateStudentData(data);

    return this.runInTransaction(async (repo) => {
      const existing = await repo.findById(id);

      if (!existing || !existing.active) {
        throw studentNotFound();
      }

      const danceClass = await this.findClassOrFail(
        repo,
        danceClassId,
      );

      const currentClassId = existing.enrollments?.[0]?.classId;
      const changedClass = currentClassId !== danceClassId;

      if (changedClass) {
        await this.assertClassHasRoom(repo, danceClass);
      }

      const updated = await repo.updateStudent(id, student);

      if (!updated) {
        throw studentNotFound();
      }

      await this.syncGuardian(repo, id, guardian);

      if (changedClass) {
        await repo.setActiveEnrollment(id, danceClassId);
      }

      return toStudentResponse(await repo.findById(id));
    });
  }

  // Atrela um aluno já cadastrado a uma turma. No modelo do front o aluno
  // fica em uma turma só, então a matrícula anterior (se houver) é cancelada.
  async enroll(classId, data = {}) {
    assertValidClassId(classId);

    const { studentId } = data;

    if (typeof studentId !== 'string' || !UUID_PATTERN.test(studentId)) {
      throw validationError({ studentId: 'Selecione um aluno válido.' });
    }

    return this.runInTransaction(async (repo) => {
      const danceClass = await repo.findActiveClassById(classId);

      if (!danceClass) {
        throw classNotFound();
      }

      const student = await repo.findById(studentId);

      if (!student || !student.active) {
        throw studentNotFound();
      }

      if (student.enrollments?.[0]?.classId === classId) {
        return toStudentResponse(student);
      }

      await this.assertClassHasRoom(repo, danceClass);
      await repo.setActiveEnrollment(studentId, classId);

      return toStudentResponse(await repo.findById(studentId));
    });
  }

  // Tira o aluno da turma sem excluí-lo (ele fica sem turma).
  async unenroll(classId, studentId) {
    assertValidClassId(classId);
    assertValidStudentId(studentId);

    return this.runInTransaction(async (repo) => {
      const student = await repo.findById(studentId);

      if (!student) {
        throw studentNotFound();
      }

      const enrolled = student.enrollments?.some(
        (enrollment) => enrollment.classId === classId,
      );

      if (!enrolled) {
        throw new AppError(
          404,
          'ENROLLMENT_NOT_FOUND',
          'O aluno não está matriculado nesta turma.',
        );
      }

      await repo.cancelEnrollment(studentId, classId);

      return toStudentResponse(await repo.findById(studentId));
    });
  }

  // "Excluir" aluno = inativar (soft delete): o aluno sai das listagens e
  // a matrícula ativa é cancelada (libera a vaga), mas o histórico
  // (matrículas, avisos, responsável) é preservado.
  async inactivate(id) {
    assertValidStudentId(id);

    return this.runInTransaction(async (repo) => {
      const existing = await repo.findById(id);

      if (!existing) {
        throw studentNotFound();
      }

      if (!existing.active) {
        return toStudentResponse(existing);
      }

      const inactive = await repo.inactivateStudent(id);

      if (!inactive) {
        throw studentNotFound();
      }

      await repo.cancelActiveEnrollments(id);

      return toStudentResponse(await repo.findById(id));
    });
  }

  async runInTransaction(callback) {
    try {
      return await this.studentRepository.transaction(callback);
    } catch (error) {
      // Corrida: outro cadastro criou o mesmo e-mail de responsável.
      if (error?.code === 'P2002') {
        throw new AppError(
          409,
          'GUARDIAN_CONFLICT',
          'Já existe um responsável com este e-mail. Tente novamente.',
        );
      }

      throw error;
    }
  }

  async findClassOrFail(repo, danceClassId) {
    const danceClass = await repo.findActiveClassById(danceClassId);

    if (!danceClass) {
      throw validationError({
        danceClassId: 'Turma não encontrada.',
      });
    }

    return danceClass;
  }

  // Só bloqueia quando a turma tem limite de vagas (capacity).
  async assertClassHasRoom(repo, danceClass) {
    if (danceClass.capacity === null || danceClass.capacity === undefined) {
      return;
    }

    const enrolled = await repo.countActiveEnrollments(
      danceClass.id,
    );

    if (enrolled >= danceClass.capacity) {
      throw new AppError(
        409,
        'CLASS_FULL',
        'A turma não tem vagas disponíveis.',
      );
    }
  }

  // Aluno menor: vincula o responsável informado (reaproveitando o
  // cadastro que tiver o mesmo e-mail). Aluno maior: sem responsável.
  async syncGuardian(repo, studentId, guardian) {
    if (!guardian) {
      await repo.setGuardian(studentId, null);
      return;
    }

    let guardianId;
    const existing = guardian.email
      ? await repo.findGuardianByEmail(guardian.email)
      : null;

    if (existing) {
      guardianId = existing.id;

      if (existing.name !== guardian.name) {
        await repo.updateGuardianName(existing.id, guardian.name);
      }
    } else {
      guardianId = (await repo.createGuardian(guardian)).id;
    }

    await repo.setGuardian(studentId, guardianId);
  }
}
