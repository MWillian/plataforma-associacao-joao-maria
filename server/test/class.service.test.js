import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ClassService } from '../src/services/class.service.js';

const CLASS_ID = '3b1c0a54-7a0e-4f0b-9a2f-5d8f6a1c2e77';

function createRepository(overrides = {}) {
  return {
    create: async (data) => ({ id: CLASS_ID, active: true, ...data }),
    update: async (id, data) => ({ id, active: true, ...data }),
    findById: async (id) => ({ id, active: true }),
    listActive: async () => [],
    inactivate: async (id) => ({ id, active: false }),
    ...overrides,
  };
}

function validData(overrides = {}) {
  return {
    name: 'Balé Iniciante',
    turn: 'Tarde',
    days: ['Segunda-feira', 'Quarta-feira'],
    capacity: 15,
    ...overrides,
  };
}

async function assertValidationError(promise, field) {
  await assert.rejects(promise, (error) => {
    assert.equal(error.statusCode, 400);
    assert.equal(error.code, 'VALIDATION_ERROR');
    assert.ok(error.fields?.[field], `esperava erro no campo ${field}`);
    return true;
  });
}

describe('ClassService.create', () => {
  it('normaliza e cadastra uma turma', async () => {
    let receivedData;
    const service = new ClassService(
      createRepository({
        create: async (data) => {
          receivedData = data;
          return { id: CLASS_ID, active: true, ...data };
        },
      }),
    );

    const result = await service.create(
      validData({ name: '  Balé Iniciante  ' }),
    );

    assert.deepEqual(receivedData, {
      name: 'Balé Iniciante',
      turn: 'Tarde',
      days: ['Segunda-feira', 'Quarta-feira'],
      capacity: 15,
    });
    assert.equal(result.id, CLASS_ID);
  });

  it('aceita turma sem capacidade e grava null', async () => {
    let receivedData;
    const service = new ClassService(
      createRepository({
        create: async (data) => {
          receivedData = data;
          return { id: CLASS_ID, ...data };
        },
      }),
    );

    await service.create(validData({ capacity: undefined }));

    assert.equal(receivedData.capacity, null);
  });

  it('remove dias repetidos preservando a ordem', async () => {
    let receivedData;
    const service = new ClassService(
      createRepository({
        create: async (data) => {
          receivedData = data;
          return { id: CLASS_ID, ...data };
        },
      }),
    );

    await service.create(
      validData({
        days: ['Sexta-feira', 'Segunda-feira', 'Sexta-feira'],
      }),
    );

    assert.deepEqual(receivedData.days, [
      'Sexta-feira',
      'Segunda-feira',
    ]);
  });

  for (const invalidName of [undefined, '', '   ', 123]) {
    it(`rejeita nome inválido: ${String(invalidName)}`, async () => {
      const service = new ClassService(createRepository());

      await assertValidationError(
        service.create(validData({ name: invalidName })),
        'name',
      );
    });
  }

  for (const invalidTurn of [undefined, '', 'Madrugada', 'tarde']) {
    it(`rejeita turno inválido: ${String(invalidTurn)}`, async () => {
      const service = new ClassService(createRepository());

      await assertValidationError(
        service.create(validData({ turn: invalidTurn })),
        'turn',
      );
    });
  }

  for (const invalidDays of [
    undefined,
    [],
    'Segunda-feira',
    ['Segunda'],
    ['Segunda-feira', 'Feriado'],
  ]) {
    it(`rejeita dias inválidos: ${JSON.stringify(invalidDays)}`, async () => {
      const service = new ClassService(createRepository());

      await assertValidationError(
        service.create(validData({ days: invalidDays })),
        'days',
      );
    });
  }

  for (const invalidCapacity of [0, -1, 1.5, '10', NaN, 2147483648]) {
    it(`rejeita capacidade inválida: ${String(invalidCapacity)}`, async () => {
      const service = new ClassService(createRepository());

      await assertValidationError(
        service.create(validData({ capacity: invalidCapacity })),
        'capacity',
      );
    });
  }

  it('reporta todos os campos inválidos de uma vez', async () => {
    const service = new ClassService(createRepository());

    await assert.rejects(service.create({}), (error) => {
      assert.equal(error.statusCode, 400);
      assert.deepEqual(
        Object.keys(error.fields).sort(),
        ['days', 'name', 'turn'],
      );
      return true;
    });
  });

  it('não chama o repository quando a validação falha', async () => {
    let called = false;
    const service = new ClassService(
      createRepository({
        create: async () => {
          called = true;
        },
      }),
    );

    await assert.rejects(service.create({ name: '' }));
    assert.equal(called, false);
  });

  it('ignora campos desconhecidos, como active e id', async () => {
    let receivedData;
    const service = new ClassService(
      createRepository({
        create: async (data) => {
          receivedData = data;
          return { id: CLASS_ID, ...data };
        },
      }),
    );

    await service.create(validData({ active: false, id: 'x' }));

    assert.deepEqual(Object.keys(receivedData).sort(), [
      'capacity',
      'days',
      'name',
      'turn',
    ]);
  });
});

describe('ClassService.update', () => {
  it('rejeita reduzir a capacidade abaixo dos alunos matriculados', async () => {
    const service = new ClassService(
      createRepository({
        findById: async (id) => ({ id, active: true, capacity: 10 }),
        countActiveEnrollments: async () => 6,
        update: async () => {
          throw new Error('o repository não deveria ser chamado');
        },
      }),
    );

    await assert.rejects(
      service.update(CLASS_ID, validData({ capacity: 5 })),
      (error) => {
        assert.equal(error.statusCode, 409);
        assert.equal(error.code, 'CLASS_CAPACITY_BELOW_STUDENT_COUNT');
        return true;
      },
    );
  });

  it('normaliza e atualiza uma turma', async () => {
    let received;
    const service = new ClassService(
      createRepository({
        update: async (id, data) => {
          received = { id, data };
          return { id, active: true, ...data };
        },
      }),
    );

    const result = await service.update(
      CLASS_ID,
      validData({
        name: '  Jazz Avançado  ',
        turn: 'Noite',
        days: ['Terça-feira', 'Quinta-feira', 'Terça-feira'],
        capacity: 20,
      }),
    );

    assert.equal(received.id, CLASS_ID);
    assert.deepEqual(received.data, {
      name: 'Jazz Avançado',
      turn: 'Noite',
      days: ['Terça-feira', 'Quinta-feira'],
      capacity: 20,
    });
    assert.equal(result.id, CLASS_ID);
  });

  it('limpa a capacidade quando ela não é enviada', async () => {
    let receivedData;
    const service = new ClassService(
      createRepository({
        update: async (id, data) => {
          receivedData = data;
          return { id, ...data };
        },
      }),
    );

    await service.update(CLASS_ID, validData({ capacity: undefined }));

    assert.equal(receivedData.capacity, null);
  });

  for (const invalidId of [undefined, '', '123', 'não-é-uuid']) {
    it(`rejeita identificador inválido: ${String(invalidId)}`, async () => {
      let called = false;
      const service = new ClassService(
        createRepository({
          update: async () => {
            called = true;
          },
        }),
      );

      await assert.rejects(
        service.update(invalidId, validData()),
        (error) => {
          assert.equal(error.statusCode, 400);
          assert.equal(error.code, 'VALIDATION_ERROR');
          return true;
        },
      );
      assert.equal(called, false);
    });
  }

  it('retorna 404 quando a turma não existe', async () => {
    const service = new ClassService(
      createRepository({ update: async () => null }),
    );

    await assert.rejects(
      service.update(CLASS_ID, validData()),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'CLASS_NOT_FOUND');
        return true;
      },
    );
  });

  it('rejeita dados inválidos sem chamar o repository', async () => {
    let called = false;
    const service = new ClassService(
      createRepository({
        update: async () => {
          called = true;
        },
      }),
    );

    await assertValidationError(
      service.update(CLASS_ID, validData({ turn: 'Madrugada' })),
      'turn',
    );
    await assertValidationError(
      service.update(CLASS_ID, validData({ days: [] })),
      'days',
    );
    await assertValidationError(
      service.update(CLASS_ID, validData({ capacity: 0 })),
      'capacity',
    );
    assert.equal(called, false);
  });

  it('não permite alterar active nem id pela atualização', async () => {
    let receivedData;
    const service = new ClassService(
      createRepository({
        update: async (id, data) => {
          receivedData = data;
          return { id, ...data };
        },
      }),
    );

    await service.update(
      CLASS_ID,
      validData({ active: false, id: 'outro' }),
    );

    assert.deepEqual(Object.keys(receivedData).sort(), [
      'capacity',
      'days',
      'name',
      'turn',
    ]);
  });

  it('propaga erros inesperados do repository', async () => {
    const service = new ClassService(
      createRepository({
        update: async () => {
          throw new Error('falha no banco');
        },
      }),
    );

    await assert.rejects(
      service.update(CLASS_ID, validData()),
      /falha no banco/,
    );
  });
});

describe('ClassService.inactivate', () => {
  it('inativa uma turma ativa', async () => {
    let inactivatedId;
    const service = new ClassService(
      createRepository({
        inactivate: async (id) => {
          inactivatedId = id;
          return { id, active: false };
        },
      }),
    );

    const result = await service.inactivate(CLASS_ID);

    assert.equal(inactivatedId, CLASS_ID);
    assert.equal(result.active, false);
  });

  for (const invalidId of [undefined, '', '123', 'não-é-uuid']) {
    it(`rejeita identificador inválido: ${String(invalidId)}`, async () => {
      let called = false;
      const service = new ClassService(
        createRepository({
          findById: async () => {
            called = true;
          },
        }),
      );

      await assert.rejects(
        service.inactivate(invalidId),
        (error) => {
          assert.equal(error.statusCode, 400);
          assert.equal(error.code, 'VALIDATION_ERROR');
          return true;
        },
      );
      assert.equal(called, false);
    });
  }

  it('retorna 404 quando a turma não existe', async () => {
    const service = new ClassService(
      createRepository({ findById: async () => null }),
    );

    await assert.rejects(
      service.inactivate(CLASS_ID),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'CLASS_NOT_FOUND');
        return true;
      },
    );
  });

  it('não atualiza novamente uma turma já inativa', async () => {
    let inactivateCalled = false;
    const service = new ClassService(
      createRepository({
        findById: async (id) => ({ id, active: false }),
        inactivate: async () => {
          inactivateCalled = true;
        },
      }),
    );

    const result = await service.inactivate(CLASS_ID);

    assert.equal(result.active, false);
    assert.equal(inactivateCalled, false);
  });

  it('retorna 404 se a turma desaparecer durante a operação', async () => {
    const service = new ClassService(
      createRepository({ inactivate: async () => null }),
    );

    await assert.rejects(
      service.inactivate(CLASS_ID),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.code, 'CLASS_NOT_FOUND');
        return true;
      },
    );
  });
});

describe('ClassService.list', () => {
  it('devolve as turmas ativas fornecidas pelo repository', async () => {
    const rows = [
      { id: CLASS_ID, name: 'Ballet Infantil A', turn: 'Tarde', days: ['Terça-feira'] },
      { id: 'outra', name: 'Jazz', turn: 'Manhã', days: ['Quinta-feira'] },
    ];
    const service = new ClassService(
      createRepository({ listActive: async () => rows }),
    );

    assert.deepEqual(await service.list(), rows);
  });

  it('devolve lista vazia quando não há turmas', async () => {
    const service = new ClassService(createRepository());

    assert.deepEqual(await service.list(), []);
  });

  it('propaga erros inesperados do repository', async () => {
    const service = new ClassService(
      createRepository({
        listActive: async () => {
          throw new Error('falha no banco');
        },
      }),
    );

    await assert.rejects(service.list(), /falha no banco/);
  });
});
