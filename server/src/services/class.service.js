import { AppError } from '../utils/app-error.js';

export const CLASS_TURNS = ['Manhã', 'Tarde', 'Noite'];

export const CLASS_DAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Limite do tipo INTEGER do PostgreSQL (evita erro 500 por overflow).
const MAX_CAPACITY = 2147483647;

function validateClassData(data) {
  const { name, turn, days, capacity } = data;
  const fields = {};

  const normalizedName =
    typeof name === 'string' ? name.trim() : '';

  if (!normalizedName) {
    fields.name = 'O nome da turma é obrigatório.';
  }

  if (!CLASS_TURNS.includes(turn)) {
    fields.turn = `O turno deve ser um destes: ${CLASS_TURNS.join(', ')}.`;
  }

  let normalizedDays = [];

  if (!Array.isArray(days) || days.length === 0) {
    fields.days = 'Selecione pelo menos um dia da semana.';
  } else if (!days.every((day) => CLASS_DAYS.includes(day))) {
    fields.days = `Os dias devem ser: ${CLASS_DAYS.join(', ')}.`;
  } else {
    normalizedDays = [...new Set(days)];
  }

  let normalizedCapacity = null;

  if (capacity !== undefined && capacity !== null) {
    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > MAX_CAPACITY
    ) {
      fields.capacity =
        'A capacidade deve ser um número inteiro maior que zero.';
    } else {
      normalizedCapacity = capacity;
    }
  }

  if (Object.keys(fields).length > 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Dados da turma inválidos.',
      fields,
    );
  }

  return {
    name: normalizedName,
    turn,
    days: normalizedDays,
    capacity: normalizedCapacity,
  };
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

function classAlreadyExists() {
  return new AppError(
    409,
    'CLASS_ALREADY_EXISTS',
    'Já existe uma turma ativa com este nome.',
    { name: 'Já existe uma turma ativa com este nome.' },
  );
}

function classNotFound() {
  return new AppError(
    404,
    'CLASS_NOT_FOUND',
    'Turma não encontrada.',
  );
}

export class ClassService {
  constructor(classRepository) {
    this.classRepository = classRepository;
  }

  async list() {
    return this.classRepository.listActive();
  }

  // Bloqueia nome repetido entre turmas ativas (ignora maiúsculas/minúsculas
  // e espaços nas pontas). Na edição, a própria turma não conta.
  async assertNameAvailable(name, ignoreId = null) {
    if (typeof this.classRepository.findActiveByName !== 'function') {
      return;
    }

    const existing = await this.classRepository.findActiveByName(name);

    if (existing && existing.id !== ignoreId) {
      throw classAlreadyExists();
    }
  }

  async create(data = {}) {
    const validatedData = validateClassData(data);

    await this.assertNameAvailable(validatedData.name);

    return this.classRepository.create(validatedData);
  }

  async update(id, data = {}) {
    assertValidClassId(id);

    const validatedData = validateClassData(data);
    const existing = await this.classRepository.findById(id);

    if (!existing) {
      throw classNotFound();
    }

    await this.assertNameAvailable(validatedData.name, id);

    if (
      validatedData.capacity !== null &&
      typeof this.classRepository.countActiveEnrollments === 'function'
    ) {
      if (typeof this.classRepository.lockClassById === 'function') {
        await this.classRepository.lockClassById(id);
      }

      const activeStudents =
        await this.classRepository.countActiveEnrollments(id);

      if (validatedData.capacity < activeStudents) {
        throw new AppError(
          409,
          'CLASS_CAPACITY_BELOW_STUDENT_COUNT',
          `A capacidade não pode ser menor que o número atual de ${activeStudents} aluno(s) matriculado(s).`,
          { capacity: 'A capacidade não pode ser menor que os alunos matriculados.' },
        );
      }
    }

    let danceClass;

    try {
      danceClass = await this.classRepository.update(
        id,
        validatedData,
      );
    } catch (error) {
      if (error?.code === 'CLASS_CAPACITY_BELOW_STUDENT_COUNT') {
        throw new AppError(
          409,
          'CLASS_CAPACITY_BELOW_STUDENT_COUNT',
          error.message,
          { capacity: 'A capacidade não pode ser menor que os alunos matriculados.' },
        );
      }

      throw error;
    }

    if (!danceClass) {
      throw classNotFound();
    }

    return danceClass;
  }

  // "Excluir" turma = inativar (soft delete): matrículas e avisos
  // vinculados são preservados como histórico. Como no front, os alunos
  // da turma também saem das listagens (ver ClassRepository.inactivate).
  async inactivate(id) {
    assertValidClassId(id);

    const danceClass = await this.classRepository.findById(id);

    if (!danceClass) {
      throw classNotFound();
    }

    if (!danceClass.active) {
      return danceClass;
    }

    const inactiveClass =
      await this.classRepository.inactivate(id);

    if (!inactiveClass) {
      throw classNotFound();
    }

    return inactiveClass;
  }
}
