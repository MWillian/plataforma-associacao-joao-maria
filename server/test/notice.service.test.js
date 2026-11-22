import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { NoticeService } from '../src/services/notice.service.js';

const UUID = '00000000-0000-4000-8000-000000000456';

describe('NoticeService', () => {
  it('cria um aviso para turmas ativas', async () => {
    let received;
    const service = new NoticeService({
      findActiveClasses: async (classIds) =>
        classIds.map((id) => ({ id })),
      create: async (data) => {
        received = data;
        return { id: UUID, ...data };
      },
    });

    const result = await service.create(1, {
      type: 'INFORMATION',
      subject: '  Ensaio  ',
      message: '  Levar uniforme  ',
      classIds: [UUID],
    });

    assert.equal(result.id, UUID);
    assert.equal(received.type, 'INFORMATION');
  });

  it('rejeita aviso sem turma', async () => {
    const service = new NoticeService({});

    await assert.rejects(
      service.create(1, {
        type: 'INFORMATION',
        subject: 'Aviso',
        message: 'Mensagem',
        classIds: [],
      }),
      (error) => error.statusCode === 400,
    );
  });
});
