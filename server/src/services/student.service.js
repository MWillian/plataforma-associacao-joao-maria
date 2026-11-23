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
function validateStudentData(data, { requireClass = true } = {}) {
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
    const normalizedPhone = normalizePhone(data.phone);
    if (normalizedPhone) {
      phone = normalizedPhone;
    } else {
      fields.phone = 'Telefone inválido. Informe DDD e número.';
    }
  }

  let danceClassIds = [];
  const rawDanceClassIds = Array.isArray(data.danceClassIds)
    ? data.danceClassIds
    : data.danceClassId
      ? [data.danceClassId]
      : [];

  if (rawDanceClassIds.length === 0) {
    if (requireClass) {
      fields.danceClassId = 'Selecione uma turma.';
    }
  } else {
    for (const classId of rawDanceClassIds) {
      if (typeof classId !== 'string' || !UUID_PATTERN.test(classId)) {
        fields.danceClassId = 'Turma inválida.';
        break;
      }
    }

    danceClassIds = [...new Set(rawDanceClassIds)];
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

    let guardianPhone = null;

    if (isFilled(data.guardianPhone)) {
      guardianPhone = normalizePhone(data.guardianPhone);

      if (!guardianPhone) {
        fields.guardianPhone = 'Telefone do responsável inválido.';
      }
    }

    guardian = {
      name: guardianName,
      email: guardianEmail,
      phone: guardianPhone,
    };
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
    danceClassIds,
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
  const danceClassIds = (row.enrollments ?? []).map(
    (enrollment) => enrollment.classId,
  );

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    danceClassIds,
    danceClassId: danceClassIds[0] ?? null,
    isMinor: row.isMinor,
    guardian: guardian?.name ?? null,
    guardianEmail: guardian?.email ?? null,
    guardianPhone: guardian?.phone ?? null,
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
    const { student, danceClassIds, guardian } =
      validateStudentData(data);

    return this.runInTransaction(async (repo) => {
      const classes = await this.findClassesOrFail(repo, danceClassIds);

      for (const danceClass of classes) {
        await this.assertClassHasRoom(repo, danceClass);
      }

      let created;

      try {
        created = await repo.createStudent(student);
      } catch (error) {
        throw this.studentUniqueConflict(error);
      }

      await this.syncGuardian(repo, created.id, guardian);
      await this.setActiveEnrollments(repo, created.id, danceClassIds);

      return toStudentResponse(await repo.findById(created.id));
    });
  }

  // PUT: substitui os dados do aluno (campos opcionais omitidos são
  // limpos). Trocar `danceClassId` move o aluno de turma. Aluno inativo
  // (excluído) não pode ser editado.
  async update(id, data = {}) {
    assertValidStudentId(id);

    const { student, danceClassIds, guardian } =
      validateStudentData(data, { requireClass: false });

    return this.runInTransaction(async (repo) => {
      const existing = await repo.findById(id);

      if (!existing || !existing.active) {
        throw studentNotFound();
      }

      const classes = await this.findClassesOrFail(repo, danceClassIds);
      const currentClassIds = (existing.enrollments ?? [])
        .map((enrollment) => enrollment.classId);
      const changedEnrollments =
        danceClassIds.some((classId) => !currentClassIds.includes(classId)) ||
        currentClassIds.some((classId) => !danceClassIds.includes(classId));

      if (changedEnrollments) {
        for (const danceClass of classes) {
          if (!currentClassIds.includes(danceClass.id)) {
            await this.assertClassHasRoom(repo, danceClass);
          }
        }
      }

      let updated;

      try {
        updated = await repo.updateStudent(id, student);
      } catch (error) {
        throw this.studentUniqueConflict(error);
      }

      if (!updated) {
        throw studentNotFound();
      }

      await this.syncGuardian(repo, id, guardian);

      if (changedEnrollments) {
        await this.setActiveEnrollments(repo, id, danceClassIds);
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

      if (student.enrollments?.some(
        (enrollment) => enrollment.classId === classId,
      )) {
        return toStudentResponse(student);
      }

      await this.assertClassHasRoom(repo, danceClass);
      if (typeof repo.addActiveEnrollment === 'function') {
        await repo.addActiveEnrollment(studentId, classId);
      } else {
        await repo.setActiveEnrollment(studentId, classId);
      }

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
      if (error?.code === 'P2002') {
        const target = this.getPrismaUniqueTarget(error);

        if (
          target.includes('guardian') ||
          target.includes('email') && error.guardianConflict
        ) {
          throw new AppError(
            409,
            'GUARDIAN_CONFLICT',
            'Já existe um responsável com estes dados.',
            { guardianEmail: 'Este e-mail de responsável já está cadastrado.' },
          );
        }

        if (target.includes('student') && target.includes('class')) {
          throw new AppError(
            409,
            'ENROLLMENT_CONFLICT',
            'Esta matrícula já está cadastrada.',
          );
        }

        if (target.includes('student') && target.includes('guardian')) {
          throw new AppError(
            409,
            'STUDENT_GUARDIAN_CONFLICT',
            'Este vínculo entre aluno e responsável já existe.',
          );
        }

        if (target.includes('student') && target.includes('email')) {
          throw new AppError(
            409,
            'STUDENT_EMAIL_CONFLICT',
            'Já existe um aluno com este e-mail.',
            { email: 'Este e-mail já está cadastrado.' },
          );
        }

        throw new AppError(
          409,
          'UNIQUE_CONSTRAINT_CONFLICT',
          'Os dados informados já estão vinculados a outro registro.',
        );
      }

      throw error;
    }
  }

  getPrismaUniqueTarget(error) {
    const target = error?.meta?.target;

    if (Array.isArray(target)) {
      return target.join('_').toLowerCase();
    }

    return String(target ?? '').toLowerCase();
  }

  studentUniqueConflict(error) {
    if (error?.code !== 'P2002') {
      return error;
    }

    const target = this.getPrismaUniqueTarget(error);

    if (target.includes('email')) {
      return new AppError(
        409,
        'STUDENT_EMAIL_CONFLICT',
        'Já existe um aluno com este e-mail.',
        { email: 'Este e-mail já está cadastrado.' },
      );
    }

    return new AppError(
      409,
      'STUDENT_CONFLICT',
      'Os dados informados já estão vinculados a outro aluno.',
    );
  }

  async findClassOrFail(repo, danceClassId) {
    const danceClass = await repo.findActiveClassById(danceClassId);

    if (!danceClass) {
      throw validationError({
        danceClassId: 'Turma não encontrada.',
        danceClassIds: 'Uma das turmas selecionadas não foi encontrada.',
      });
    }

    return danceClass;
  }

  async findClassesOrFail(repo, danceClassIds) {
    const classes = [];

    for (const danceClassId of danceClassIds) {
      classes.push(await this.findClassOrFail(repo, danceClassId));
    }

    return classes;
  }

  async setActiveEnrollments(repo, studentId, danceClassIds) {
    if (typeof repo.setActiveEnrollments === 'function') {
      await repo.setActiveEnrollments(studentId, danceClassIds);
      return;
    }

    for (const danceClassId of danceClassIds) {
      await repo.setActiveEnrollment(studentId, danceClassId);
    }
  }

  // Só bloqueia quando a turma tem limite de vagas (capacity).
  async assertClassHasRoom(repo, danceClass) {
    if (danceClass.capacity === null || danceClass.capacity === undefined) {
      return;
    }

    if (typeof repo.lockClassById === 'function') {
      await repo.lockClassById(danceClass.id);
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

    try {
      let guardianId;
      const existing = guardian.email
        ? await repo.findGuardianByEmail(guardian.email)
        : null;

      if (existing) {
        guardianId = existing.id;

        if (
          existing.name !== guardian.name ||
          existing.phone !== guardian.phone
        ) {
          if (typeof repo.updateGuardian === 'function') {
            await repo.updateGuardian(existing.id, {
              name: guardian.name,
              phone: guardian.phone,
            });
          } else {
            await repo.updateGuardianName(existing.id, guardian.name);
          }
        }
      } else {
        guardianId = (await repo.createGuardian(guardian)).id;
      }

      await repo.setGuardian(studentId, guardianId);
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new AppError(
          409,
          'GUARDIAN_CONFLICT',
          'Já existe um responsável com estes dados.',
          {
            guardianEmail:
              guardian.email
                ? 'Este e-mail de responsável já está cadastrado.'
                : 'Os dados informados já estão vinculados a outro responsável.',
            ...(this.getPrismaUniqueTarget(error).includes('cpf')
              ? {
                  guardianCpf:
                    'Este CPF de responsável já está cadastrado.',
                }
              : {}),
          },
        );
      }

      throw error;
    }
  }
}
