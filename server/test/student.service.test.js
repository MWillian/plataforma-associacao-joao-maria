import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { StudentService } from '../src/services/student.service.js';

const uuid = (n) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const CLASS_A = uuid(901);
const CLASS_B = uuid(902);
const CLASS_INACTIVE = uuid(903);
const CLASS_SMALL = uuid(904);
const MISSING_ID = uuid(999);

// Repository em memória que imita o comportamento esperado do Prisma.
class FakeStudentRepository {
  constructor() {
    this.sequence = 0;
    this.students = new Map();
    this.guardians = new Map();
    this.links = [];
    this.enrollments = [];
    this.classes = new Map([
      [CLASS_A, { id: CLASS_A, name: 'A', active: true, capacity: null }],
      [CLASS_B, { id: CLASS_B, name: 'B', active: true, capacity: null }],
      [
        CLASS_INACTIVE,
        { id: CLASS_INACTIVE, name: 'I', active: false, capacity: null },
      ],
      [
        CLASS_SMALL,
        { id: CLASS_SMALL, name: 'S', active: true, capacity: 1 },
      ],
    ]);
    this.inactivateRace = false;
  }

  nextId() {
    this.sequence += 1;
    return uuid(this.sequence);
  }

  async transaction(callback) {
    return callback(this);
  }

  async findById(id) {
    const student = this.students.get(id);

    if (!student) {
      return null;
    }

    return {
      ...student,
      guardians: this.links
        .filter((link) => link.studentId === id)
        .map((link) => ({
          relationship: 'Responsável',
          guardian: this.guardians.get(link.guardianId),
        })),
      enrollments: this.enrollments.filter(
        (enrollment) =>
          enrollment.studentId === id && enrollment.status === 'ACTIVE',
      ),
    };
  }

  async listActive() {
    const rows = [];

    for (const id of this.students.keys()) {
      if (this.students.get(id).active) {
        rows.push(await this.findById(id));
      }
    }

    return rows;
  }

  async listActiveByClass(classId) {
    return (await this.listActive()).filter((row) =>
      row.enrollments.some((enrollment) => enrollment.classId === classId),
    );
  }

  async cancelEnrollment(studentId, classId) {
    for (const enrollment of this.enrollments) {
      if (
        enrollment.studentId === studentId &&
        enrollment.classId === classId &&
        enrollment.status === 'ACTIVE'
      ) {
        enrollment.status = 'CANCELED';
      }
    }
  }

  async findActiveClassById(id) {
    const danceClass = this.classes.get(id);

    return danceClass?.active ? danceClass : null;
  }

  async countActiveEnrollments(classId) {
    return this.enrollments.filter(
      (enrollment) =>
        enrollment.classId === classId && enrollment.status === 'ACTIVE',
    ).length;
  }

  async findGuardianByEmail(email) {
    return (
      [...this.guardians.values()].find((guardian) => guardian.email === email) ??
      null
    );
  }

  async createGuardian({ name, email }) {
    const guardian = { id: this.nextId(), name, email };

    this.guardians.set(guardian.id, guardian);

    return guardian;
  }

  async updateGuardianName(id, name) {
    this.guardians.get(id).name = name;
  }

  async createStudent(data) {
    const student = {
      id: this.nextId(),
      active: true,
      createdAt: new Date('2026-11-21T12:00:00Z'),
      updatedAt: new Date('2026-11-21T12:00:00Z'),
      ...data,
    };

    this.students.set(student.id, student);

    return student;
  }

  async updateStudent(id, data) {
    const student = this.students.get(id);

    if (!student) {
      return null;
    }

    Object.assign(student, data);

    return student;
  }

  async inactivateStudent(id) {
    if (this.inactivateRace) {
      return null;
    }

    return this.updateStudent(id, { active: false });
  }

  async setGuardian(studentId, guardianId) {
    this.links = this.links.filter((link) => link.studentId !== studentId);

    if (guardianId) {
      this.links.push({ studentId, guardianId });
    }
  }

  async setActiveEnrollment(studentId, classId) {
    for (const enrollment of this.enrollments) {
      if (
        enrollment.studentId === studentId &&
        enrollment.status === 'ACTIVE' &&
        enrollment.classId !== classId
      ) {
        enrollment.status = 'CANCELED';
      }
    }

    const existing = this.enrollments.find(
      (enrollment) =>
        enrollment.studentId === studentId && enrollment.classId === classId,
    );

    if (existing) {
      existing.status = 'ACTIVE';
    } else {
      this.enrollments.push({ studentId, classId, status: 'ACTIVE' });
    }
  }

  async cancelActiveEnrollments(studentId) {
    for (const enrollment of this.enrollments) {
      if (enrollment.studentId === studentId) {
        enrollment.status = 'CANCELED';
      }
    }
  }
}

let repo;
let service;

beforeEach(() => {
  repo = new FakeStudentRepository();
  service = new StudentService(repo);
});

function validData(overrides = {}) {
  return {
    name: 'Lucas Ferreira',
    danceClassId: CLASS_A,
    ...overrides,
  };
}

function minorData(overrides = {}) {
  return validData({
    isMinor: true,
    guardian: 'Maria Ferreira (Mãe)',
    guardianEmail: 'Maria@Email.com',
    ...overrides,
  });
}

async function assertValidationError(promise, field) {
  await assert.rejects(promise, (error) => {
    assert.equal(error.statusCode, 400);
    assert.equal(error.code, 'VALIDATION_ERROR');
    assert.ok(error.fields?.[field], `esperava erro no campo ${field}`);
    return true;
  });
}

describe('StudentService.create', () => {
  it('cadastra aluno só com nome e turma', async () => {
    const result = await service.create(validData());

    assert.equal(result.name, 'Lucas Ferreira');
    assert.equal(result.danceClassId, CLASS_A);
    assert.equal(result.email, null);
    assert.equal(result.phone, null);
    assert.equal(result.isMinor, false);
    assert.equal(result.guardian, null);
    assert.equal(result.guardianEmail, null);
    assert.equal(result.active, true);
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 1);
  });

  it('cadastra aluno menor com responsável e ficha médica', async () => {
    const result = await service.create(
      minorData({
        name: '  Lucas Ferreira  ',
        email: ' LUCAS@Email.com ',
        phone: '(11) 99234-5678',
        allergies: '  Amendoim ',
        medicalConditions: '',
        medications: '   ',
        physicalRestrictions: 'Joelho',
      }),
    );

    assert.equal(result.name, 'Lucas Ferreira');
    assert.equal(result.email, 'lucas@email.com');
    assert.equal(result.phone, '(11) 99234-5678');
    assert.equal(result.isMinor, true);
    assert.equal(result.guardian, 'Maria Ferreira (Mãe)');
    assert.equal(result.guardianEmail, 'maria@email.com');
    assert.equal(result.allergies, 'Amendoim');
    assert.equal(result.medicalConditions, null);
    assert.equal(result.medications, null);
    assert.equal(result.physicalRestrictions, 'Joelho');
  });

  it('ignora os dados do responsável quando o aluno não é menor', async () => {
    const result = await service.create(
      validData({
        isMinor: false,
        guardian: 'Alguém',
        guardianEmail: 'email-invalido',
      }),
    );

    assert.equal(result.guardian, null);
    assert.equal(result.guardianEmail, null);
    assert.equal(repo.guardians.size, 0);
  });

  it('aceita responsável sem e-mail', async () => {
    const result = await service.create(
      minorData({ guardianEmail: '' }),
    );

    assert.equal(result.guardian, 'Maria Ferreira (Mãe)');
    assert.equal(result.guardianEmail, null);
  });

  it('reaproveita o responsável que tem o mesmo e-mail', async () => {
    await service.create(minorData());
    await service.create(
      minorData({
        name: 'Irmão do Lucas',
        guardian: 'Maria F. Ferreira (Mãe)',
        guardianEmail: 'maria@email.com',
      }),
    );

    assert.equal(repo.guardians.size, 1);
    assert.equal(
      [...repo.guardians.values()][0].name,
      'Maria F. Ferreira (Mãe)',
    );
    assert.equal(repo.links.length, 2);
  });

  it('cria responsáveis separados quando não há e-mail', async () => {
    await service.create(minorData({ guardianEmail: '' }));
    await service.create(minorData({ guardianEmail: '' }));

    assert.equal(repo.guardians.size, 2);
  });

  for (const invalidName of [undefined, '', '   ', 123]) {
    it(`rejeita nome inválido: ${String(invalidName)}`, async () => {
      await assertValidationError(
        service.create(validData({ name: invalidName })),
        'name',
      );
    });
  }

  for (const invalidTurma of [undefined, '', '123', 'abc', 1, MISSING_ID]) {
    it(`rejeita turma inválida ou inexistente: ${String(invalidTurma)}`, async () => {
      await assertValidationError(
        service.create(validData({ danceClassId: invalidTurma })),
        'danceClassId',
      );
    });
  }

  it('rejeita turma inativa', async () => {
    await assertValidationError(
      service.create(validData({ danceClassId: CLASS_INACTIVE })),
      'danceClassId',
    );
  });

  it('rejeita e-mail e telefone inválidos', async () => {
    await assertValidationError(
      service.create(validData({ email: 'sem-arroba' })),
      'email',
    );
    await assertValidationError(
      service.create(validData({ phone: '123' })),
      'phone',
    );
  });

  it('trata e-mail e telefone vazios como não informados', async () => {
    const result = await service.create(
      validData({ email: '', phone: '   ' }),
    );

    assert.equal(result.email, null);
    assert.equal(result.phone, null);
  });

  it('exige nome do responsável para menor de idade', async () => {
    await assertValidationError(
      service.create(validData({ isMinor: true })),
      'guardian',
    );
    await assertValidationError(
      service.create(validData({ isMinor: true, guardian: '  ' })),
      'guardian',
    );
  });

  it('rejeita e-mail do responsável inválido', async () => {
    await assertValidationError(
      service.create(minorData({ guardianEmail: 'x' })),
      'guardianEmail',
    );
  });

  it('rejeita isMinor que não seja booleano', async () => {
    await assertValidationError(
      service.create(validData({ isMinor: 'true' })),
      'isMinor',
    );
  });

  it('rejeita campo da ficha médica que não seja texto', async () => {
    await assertValidationError(
      service.create(validData({ allergies: ['amendoim'] })),
      'allergies',
    );
  });

  it('reporta todos os campos inválidos de uma vez', async () => {
    await assert.rejects(service.create({}), (error) => {
      assert.deepEqual(Object.keys(error.fields).sort(), [
        'danceClassId',
        'name',
      ]);
      return true;
    });
  });

  it('não grava nada quando a validação falha', async () => {
    await assert.rejects(service.create({ name: '' }));

    assert.equal(repo.students.size, 0);
    assert.equal(repo.enrollments.length, 0);
  });

  it('retorna 409 quando a turma não tem vagas', async () => {
    await service.create(validData({ danceClassId: CLASS_SMALL }));

    await assert.rejects(
      service.create(validData({ danceClassId: CLASS_SMALL })),
      (error) => {
        assert.equal(error.statusCode, 409);
        assert.equal(error.code, 'CLASS_FULL');
        return true;
      },
    );
    assert.equal(repo.students.size, 1);
  });

  it('não limita vagas quando a turma não tem capacidade', async () => {
    for (let i = 0; i < 5; i += 1) {
      await service.create(validData());
    }

    assert.equal(await repo.countActiveEnrollments(CLASS_A), 5);
  });

  it('converte conflito de unicidade do Prisma em 409', async () => {
    repo.createGuardian = async () => {
      const error = new Error('Unique constraint failed');
      error.code = 'P2002';
      throw error;
    };

    await assert.rejects(service.create(minorData()), (error) => {
      assert.equal(error.statusCode, 409);
      assert.equal(error.code, 'GUARDIAN_CONFLICT');
      return true;
    });
  });

  it('propaga erros inesperados', async () => {
    repo.createStudent = async () => {
      throw new Error('falha no banco');
    };

    await assert.rejects(service.create(validData()), /falha no banco/);
  });
});

describe('StudentService.update', () => {
  let created;

  beforeEach(async () => {
    created = await service.create(minorData({ phone: '(11) 99234-5678' }));
  });

  it('atualiza os dados e devolve o aluno no formato do front', async () => {
    const result = await service.update(
      created.id,
      minorData({
        name: 'Lucas F. Ferreira',
        email: 'novo@email.com',
        phone: '(21) 97654-3210',
        allergies: 'Lactose',
      }),
    );

    assert.equal(result.id, created.id);
    assert.equal(result.name, 'Lucas F. Ferreira');
    assert.equal(result.email, 'novo@email.com');
    assert.equal(result.phone, '(21) 97654-3210');
    assert.equal(result.allergies, 'Lactose');
    assert.equal(result.danceClassId, CLASS_A);
  });

  it('limpa os opcionais que não forem enviados', async () => {
    const result = await service.update(
      created.id,
      validData({ isMinor: false }),
    );

    assert.equal(result.email, null);
    assert.equal(result.phone, null);
    assert.equal(result.allergies, null);
  });

  it('move o aluno de turma, cancelando a matrícula anterior', async () => {
    const result = await service.update(
      created.id,
      minorData({ danceClassId: CLASS_B }),
    );

    assert.equal(result.danceClassId, CLASS_B);
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 0);
    assert.equal(await repo.countActiveEnrollments(CLASS_B), 1);
  });

  it('volta para uma turma antiga reativando a matrícula', async () => {
    await service.update(created.id, minorData({ danceClassId: CLASS_B }));
    const result = await service.update(
      created.id,
      minorData({ danceClassId: CLASS_A }),
    );

    assert.equal(result.danceClassId, CLASS_A);
    assert.equal(repo.enrollments.length, 2);
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 1);
    assert.equal(await repo.countActiveEnrollments(CLASS_B), 0);
  });

  it('não mexe nas matrículas quando a turma não muda', async () => {
    await service.update(created.id, minorData());

    assert.equal(repo.enrollments.length, 1);
  });

  it('retorna 409 ao mover para uma turma sem vagas', async () => {
    await service.create(validData({ danceClassId: CLASS_SMALL }));

    await assert.rejects(
      service.update(created.id, minorData({ danceClassId: CLASS_SMALL })),
      (error) => {
        assert.equal(error.statusCode, 409);
        assert.equal(error.code, 'CLASS_FULL');
        return true;
      },
    );
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 1);
  });

  it('não bloqueia por vagas quando o aluno continua na mesma turma', async () => {
    const inSmall = await service.create(
      validData({ danceClassId: CLASS_SMALL }),
    );

    const result = await service.update(
      inSmall.id,
      validData({ danceClassId: CLASS_SMALL, name: 'Novo nome' }),
    );

    assert.equal(result.name, 'Novo nome');
  });

  it('troca o responsável e reaproveita o cadastro por e-mail', async () => {
    const result = await service.update(
      created.id,
      minorData({
        guardian: 'João Ferreira (Pai)',
        guardianEmail: 'joao@email.com',
      }),
    );

    assert.equal(result.guardian, 'João Ferreira (Pai)');
    assert.equal(result.guardianEmail, 'joao@email.com');
    assert.equal(repo.links.length, 1);
  });

  it('remove o responsável quando o aluno deixa de ser menor', async () => {
    const result = await service.update(
      created.id,
      validData({ isMinor: false }),
    );

    assert.equal(result.isMinor, false);
    assert.equal(result.guardian, null);
    assert.equal(repo.links.length, 0);
  });

  it('exige responsável ao marcar o aluno como menor', async () => {
    await assertValidationError(
      service.update(created.id, validData({ isMinor: true })),
      'guardian',
    );
  });

  it('rejeita turma inexistente ou inativa', async () => {
    await assertValidationError(
      service.update(created.id, minorData({ danceClassId: MISSING_ID })),
      'danceClassId',
    );
    await assertValidationError(
      service.update(created.id, minorData({ danceClassId: CLASS_INACTIVE })),
      'danceClassId',
    );
  });

  it('ignora id, active e campos desconhecidos do corpo', async () => {
    const result = await service.update(
      created.id,
      minorData({ id: MISSING_ID, active: false, qualquer: 'x' }),
    );

    assert.equal(result.id, created.id);
    assert.equal(result.active, true);
  });

  for (const invalidId of [undefined, '', '123', 'não-é-uuid']) {
    it(`rejeita identificador inválido: ${String(invalidId)}`, async () => {
      await assert.rejects(
        service.update(invalidId, validData()),
        (error) => {
          assert.equal(error.statusCode, 400);
          return true;
        },
      );
    });
  }

  it('retorna 404 quando o aluno não existe', async () => {
    await assert.rejects(
      service.update(MISSING_ID, validData()),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'STUDENT_NOT_FOUND');
        return true;
      },
    );
  });

  it('retorna 404 para aluno inativo (excluído)', async () => {
    await service.inactivate(created.id);

    await assert.rejects(
      service.update(created.id, minorData()),
      (error) => {
        assert.equal(error.statusCode, 404);
        return true;
      },
    );
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 0);
  });

  it('não altera nada quando os dados são inválidos', async () => {
    await assert.rejects(
      service.update(created.id, minorData({ name: '' })),
    );

    assert.equal(repo.students.get(created.id).name, 'Lucas Ferreira');
  });
});

describe('StudentService.inactivate', () => {
  let created;

  beforeEach(async () => {
    created = await service.create(minorData());
  });

  it('inativa o aluno e cancela a matrícula ativa', async () => {
    const result = await service.inactivate(created.id);

    assert.equal(result.active, false);
    assert.equal(result.danceClassId, null);
    assert.equal(result.guardian, 'Maria Ferreira (Mãe)');
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 0);
  });

  it('preserva o registro, o responsável e o histórico de matrícula', async () => {
    await service.inactivate(created.id);

    assert.equal(repo.students.has(created.id), true);
    assert.equal(repo.links.length, 1);
    assert.equal(repo.enrollments.length, 1);
    assert.equal(repo.enrollments[0].status, 'CANCELED');
  });

  it('libera a vaga da turma', async () => {
    const small = await service.create(
      validData({ danceClassId: CLASS_SMALL }),
    );

    await service.inactivate(small.id);

    const another = await service.create(
      validData({ danceClassId: CLASS_SMALL }),
    );

    assert.equal(another.danceClassId, CLASS_SMALL);
  });

  it('é idempotente para aluno já inativo', async () => {
    await service.inactivate(created.id);
    const result = await service.inactivate(created.id);

    assert.equal(result.active, false);
  });

  for (const invalidId of [undefined, '', '123', 'não-é-uuid']) {
    it(`rejeita identificador inválido: ${String(invalidId)}`, async () => {
      await assert.rejects(
        service.inactivate(invalidId),
        (error) => {
          assert.equal(error.statusCode, 400);
          return true;
        },
      );
    });
  }

  it('retorna 404 quando o aluno não existe', async () => {
    await assert.rejects(
      service.inactivate(MISSING_ID),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'STUDENT_NOT_FOUND');
        return true;
      },
    );
  });

  it('retorna 404 se o aluno desaparecer durante a operação', async () => {
    repo.inactivateRace = true;

    await assert.rejects(
      service.inactivate(created.id),
      (error) => {
        assert.equal(error.statusCode, 404);
        return true;
      },
    );
  });
});

describe('StudentService.list', () => {
  it('lista os alunos ativos no formato do front', async () => {
    const first = await service.create(minorData());
    await service.create(validData({ name: 'Carolina Mendes' }));

    const result = await service.list();

    assert.equal(result.length, 2);
    assert.equal(result[0].id, first.id);
    assert.equal(result[0].guardian, 'Maria Ferreira (Mãe)');
    assert.equal(result[0].danceClassId, CLASS_A);
    assert.equal(result[1].name, 'Carolina Mendes');
  });

  it('não lista alunos inativos', async () => {
    const first = await service.create(validData());
    await service.create(validData({ name: 'Carolina Mendes' }));
    await service.inactivate(first.id);

    const result = await service.list();

    assert.deepEqual(
      result.map((student) => student.name),
      ['Carolina Mendes'],
    );
  });

  it('devolve lista vazia quando não há alunos', async () => {
    assert.deepEqual(await service.list(), []);
  });
});

describe('StudentService.listByClass', () => {
  it('lista só os alunos ativos da turma', async () => {
    await service.create(validData({ name: 'Na turma A', danceClassId: CLASS_A }));
    await service.create(validData({ name: 'Na turma B', danceClassId: CLASS_B }));
    const removed = await service.create(
      validData({ name: 'Excluído', danceClassId: CLASS_A }),
    );
    await service.inactivate(removed.id);

    const result = await service.listByClass(CLASS_A);

    assert.deepEqual(
      result.map((student) => student.name),
      ['Na turma A'],
    );
  });

  it('devolve lista vazia para turma sem alunos', async () => {
    assert.deepEqual(await service.listByClass(CLASS_B), []);
  });

  it('rejeita identificador de turma inválido', async () => {
    await assert.rejects(service.listByClass('abc'), (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    });
  });

  it('retorna 404 para turma inexistente ou inativa', async () => {
    for (const id of [MISSING_ID, CLASS_INACTIVE]) {
      await assert.rejects(service.listByClass(id), (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'CLASS_NOT_FOUND');
        return true;
      });
    }
  });
});

describe('StudentService.enroll', () => {
  it('atrela um aluno sem turma a uma turma', async () => {
    const student = await service.create(validData());
    await service.unenroll(CLASS_A, student.id);

    const result = await service.enroll(CLASS_B, { studentId: student.id });

    assert.equal(result.danceClassId, CLASS_B);
    assert.equal(await repo.countActiveEnrollments(CLASS_B), 1);
  });

  it('move o aluno da turma atual, cancelando a anterior', async () => {
    const student = await service.create(validData());

    const result = await service.enroll(CLASS_B, { studentId: student.id });

    assert.equal(result.danceClassId, CLASS_B);
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 0);
  });

  it('é idempotente quando o aluno já está na turma', async () => {
    const student = await service.create(validData());

    const result = await service.enroll(CLASS_A, { studentId: student.id });

    assert.equal(result.danceClassId, CLASS_A);
    assert.equal(repo.enrollments.length, 1);
  });

  it('retorna 409 quando a turma não tem vagas', async () => {
    await service.create(validData({ danceClassId: CLASS_SMALL }));
    const other = await service.create(validData({ name: 'Outro' }));

    await assert.rejects(
      service.enroll(CLASS_SMALL, { studentId: other.id }),
      (error) => {
        assert.equal(error.statusCode, 409);
        assert.equal(error.code, 'CLASS_FULL');
        return true;
      },
    );
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 1);
  });

  it('rejeita studentId ausente ou inválido', async () => {
    for (const body of [undefined, {}, { studentId: 1 }, { studentId: 'abc' }]) {
      await assertValidationError(
        service.enroll(CLASS_A, body),
        'studentId',
      );
    }
  });

  it('rejeita identificador de turma inválido', async () => {
    await assert.rejects(
      service.enroll('abc', { studentId: MISSING_ID }),
      (error) => {
        assert.equal(error.statusCode, 400);
        return true;
      },
    );
  });

  it('retorna 404 para turma inexistente ou inativa', async () => {
    const student = await service.create(validData());

    for (const id of [MISSING_ID, CLASS_INACTIVE]) {
      await assert.rejects(
        service.enroll(id, { studentId: student.id }),
        (error) => {
          assert.equal(error.statusCode, 404);
          assert.equal(error.code, 'CLASS_NOT_FOUND');
          return true;
        },
      );
    }
  });

  it('retorna 404 para aluno inexistente ou inativo', async () => {
    const student = await service.create(validData());
    await service.inactivate(student.id);

    for (const studentId of [MISSING_ID, student.id]) {
      await assert.rejects(
        service.enroll(CLASS_B, { studentId }),
        (error) => {
          assert.equal(error.statusCode, 404);
          assert.equal(error.code, 'STUDENT_NOT_FOUND');
          return true;
        },
      );
    }
  });
});

describe('StudentService.unenroll', () => {
  it('tira o aluno da turma sem excluí-lo', async () => {
    const student = await service.create(minorData());

    const result = await service.unenroll(CLASS_A, student.id);

    assert.equal(result.danceClassId, null);
    assert.equal(result.active, true);
    assert.equal(result.guardian, 'Maria Ferreira (Mãe)');
    assert.equal(await repo.countActiveEnrollments(CLASS_A), 0);
    assert.equal((await service.list()).length, 1);
  });

  it('libera a vaga da turma', async () => {
    const student = await service.create(
      validData({ danceClassId: CLASS_SMALL }),
    );

    await service.unenroll(CLASS_SMALL, student.id);

    const another = await service.create(
      validData({ name: 'Outro', danceClassId: CLASS_SMALL }),
    );

    assert.equal(another.danceClassId, CLASS_SMALL);
  });

  it('retorna 404 quando o aluno não está nessa turma', async () => {
    const student = await service.create(validData());

    await assert.rejects(
      service.unenroll(CLASS_B, student.id),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'ENROLLMENT_NOT_FOUND');
        return true;
      },
    );
  });

  it('retorna 404 para aluno inexistente', async () => {
    await assert.rejects(
      service.unenroll(CLASS_A, MISSING_ID),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'STUDENT_NOT_FOUND');
        return true;
      },
    );
  });

  it('rejeita identificadores inválidos', async () => {
    await assert.rejects(
      service.unenroll('abc', MISSING_ID),
      (error) => error.statusCode === 400,
    );
    await assert.rejects(
      service.unenroll(CLASS_A, 'abc'),
      (error) => error.statusCode === 400,
    );
  });
});
