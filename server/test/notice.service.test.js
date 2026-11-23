import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { NoticeService } from '../src/services/notice.service.js';

const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const CLASS_A = uuid(901);
const CLASS_B = uuid(902);
const MISSING_CLASS = uuid(999);

class FakeNoticeRepository {
  constructor() {
    this.sequence = 0;
    this.classes = new Set([CLASS_A, CLASS_B]);
    this.students = [];
    this.notices = new Map();
    this.deliveries = [];
  }

  async findActiveClasses(ids) {
    return ids.filter((id) => this.classes.has(id)).map((id) => ({ id }));
  }

  async findStudentsOfClasses(classIds) {
    return this.students.filter((student) =>
      classIds.includes(student.classId),
    );
  }

  async create({ recipients, classIds, ...data }) {
    this.sequence += 1;
    const notice = {
      id: uuid(this.sequence),
      createdAt: new Date('2026-11-21T12:00:00Z'),
      sentCount: 0,
      failedCount: 0,
      archivedAt: null,
      ...data,
      classes: classIds.map((classId) => ({ classId })),
      recipients: recipients.map((recipient, index) => ({
        id: `r${this.sequence}-${index}`,
        ...recipient,
      })),
    };

    this.notices.set(notice.id, notice);

    return notice;
  }

  async saveDelivery(noticeId, results) {
    this.deliveries.push(results);
    const notice = this.notices.get(noticeId);

    notice.sentCount = results.filter((r) => r.status === 'SENT').length;
    notice.failedCount = results.filter((r) => r.status === 'FAILED').length;

    return notice;
  }

  async listActive() {
    return [...this.notices.values()].filter((n) => !n.archivedAt).reverse();
  }

  async findById(id) {
    return this.notices.get(id) ?? null;
  }

  async archive(id) {
    const notice = this.notices.get(id);

    if (!notice) {
      return null;
    }

    notice.archivedAt = new Date();

    return notice;
  }
}

let repo;
let sent;
let service;
let configured;
let failFor;

beforeEach(() => {
  repo = new FakeNoticeRepository();
  sent = [];
  configured = true;
  failFor = new Set();
  service = new NoticeService(repo, {
    isEmailConfigured: () => configured,
    sendEmail: async ({ email, subject, message }) => {
      if (failFor.has(email)) {
        throw new Error(`falha ao enviar para ${email}`);
      }

      sent.push({ email, subject, message });
    },
  });
});

const student = (id, overrides = {}) => ({
  id: uuid(id),
  name: `Aluno ${id}`,
  email: null,
  isMinor: false,
  classId: CLASS_A,
  guardians: [],
  ...overrides,
});

const guardianLink = (id, email) => ({
  guardian: { id: uuid(id), name: `Responsável ${id}`, email },
});

const valid = (overrides = {}) => ({
  danceClassIds: [CLASS_A],
  subject: 'Ensaio Extra',
  type: 'Informativo',
  message: 'Haverá ensaio na sexta.',
  ...overrides,
});

async function assertField(promise, field) {
  await assert.rejects(promise, (error) => {
    assert.equal(error.statusCode, 400);
    assert.ok(error.fields?.[field], `esperava erro em ${field}`);
    return true;
  });
}

describe('NoticeService.create — destinatários', () => {
  it('envia para o responsável do aluno menor', async () => {
    repo.students = [
      student(1, {
        isMinor: true,
        email: 'aluno@email.com',
        guardians: [guardianLink(11, 'mae@email.com')],
      }),
    ];

    const result = await service.create(1, valid());

    assert.deepEqual(sent.map((item) => item.email), ['mae@email.com']);
    assert.equal(result.sentCount, 1);
    assert.equal(result.totalRecipients, 1);
  });

  it('envia para o próprio aluno quando ele não é menor', async () => {
    repo.students = [student(1, { email: 'aluno@email.com' })];

    await service.create(1, valid());

    assert.deepEqual(sent.map((item) => item.email), ['aluno@email.com']);
  });

  it('usa o e-mail do aluno quando o menor não tem responsável com e-mail', async () => {
    repo.students = [
      student(1, {
        isMinor: true,
        email: 'aluno@email.com',
        guardians: [guardianLink(11, null)],
      }),
    ];

    await service.create(1, valid());

    assert.deepEqual(sent.map((item) => item.email), ['aluno@email.com']);
  });

  it('conta como sem e-mail quem não tem nenhum contato', async () => {
    repo.students = [
      student(1),
      student(2, { email: 'dois@email.com' }),
    ];

    const result = await service.create(1, valid());

    assert.equal(result.skippedCount, 1);
    assert.equal(result.totalRecipients, 1);
    assert.equal(result.sentCount, 1);
  });

  it('não envia duas vezes para o mesmo e-mail (irmãos)', async () => {
    repo.students = [
      student(1, { isMinor: true, guardians: [guardianLink(11, 'mae@email.com')] }),
      student(2, { isMinor: true, guardians: [guardianLink(11, 'mae@email.com')] }),
    ];

    const result = await service.create(1, valid());

    assert.equal(sent.length, 1);
    assert.equal(result.totalRecipients, 1);
    assert.equal(result.skippedCount, 0);
  });

  it('junta os alunos de várias turmas', async () => {
    repo.students = [
      student(1, { email: 'a@email.com', classId: CLASS_A }),
      student(2, { email: 'b@email.com', classId: CLASS_B }),
    ];

    const result = await service.create(
      1,
      valid({ danceClassIds: [CLASS_A, CLASS_B, CLASS_A] }),
    );

    assert.equal(result.sentCount, 2);
    assert.deepEqual(result.danceClassIds, [CLASS_A, CLASS_B]);
  });

  it('registra o aviso mesmo quando ninguém tem e-mail', async () => {
    repo.students = [student(1)];

    const result = await service.create(1, valid());

    assert.equal(result.totalRecipients, 0);
    assert.equal(result.sentCount, 0);
    assert.equal(result.skippedCount, 1);
    assert.equal(repo.notices.size, 1);
  });
});

describe('NoticeService.create — envio', () => {
  it('envia assunto e mensagem e devolve o aviso no formato do front', async () => {
    repo.students = [student(1, { email: 'a@email.com' })];

    const result = await service.create(
      7,
      valid({ type: 'Cancelamento', subject: '  Aula cancelada ', message: ' Sem aula. ' }),
    );

    assert.deepEqual(sent, [
      { email: 'a@email.com', subject: 'Aula cancelada', message: 'Sem aula.' },
    ]);
    assert.equal(result.type, 'Cancelamento');
    assert.equal(result.subject, 'Aula cancelada');
    assert.equal(repo.notices.get(result.id).senderId, 7);
    assert.equal(repo.notices.get(result.id).type, 'CANCELLATION');
  });

  it('marca como falha quem não recebeu e continua enviando aos demais', async () => {
    repo.students = [
      student(1, { email: 'ok@email.com' }),
      student(2, { email: 'erro@email.com' }),
    ];
    failFor.add('erro@email.com');

    const result = await service.create(1, valid());

    assert.equal(result.sentCount, 1);
    assert.equal(result.failedCount, 1);

    const failed = repo.deliveries[0].find((r) => r.status === 'FAILED');

    assert.match(failed.failureReason, /falha ao enviar/);
  });

  it('marca todos como falha quando o e-mail não está configurado', async () => {
    configured = false;
    repo.students = [student(1, { email: 'a@email.com' })];

    const result = await service.create(1, valid());

    assert.equal(sent.length, 0);
    assert.equal(result.failedCount, 1);
    assert.match(
      repo.deliveries[0][0].failureReason,
      /não configurado/,
    );
  });

  it('limita o envio a cinco pessoas por vez e continua após falhas entre lotes', async () => {
    repo.students = Array.from({ length: 12 }, (_, i) =>
      student(i + 1, { email: `a${i}@email.com` }),
    );
    let activeSends = 0;
    let maxConcurrentSends = 0;

    service = new NoticeService(repo, {
      isEmailConfigured: () => true,
      sendEmail: async ({ email }) => {
        activeSends += 1;
        maxConcurrentSends = Math.max(maxConcurrentSends, activeSends);
        await new Promise((resolve) => setTimeout(resolve, 1));
        activeSends -= 1;

        if (email === 'a2@email.com') {
          throw new Error('falha simulada');
        }
      },
    });

    const result = await service.create(1, valid());

    assert.equal(maxConcurrentSends, 5);
    assert.equal(result.totalRecipients, 12);
    assert.equal(result.sentCount, 11);
    assert.equal(result.failedCount, 1);
    assert.equal(repo.deliveries[0].length, 12);
  });
});

describe('NoticeService.create — validação', () => {
  it('valida assunto, mensagem, tipo e turmas', async () => {
    await assertField(service.create(1, valid({ subject: ' ' })), 'subject');
    await assertField(service.create(1, valid({ message: '' })), 'message');
    await assertField(service.create(1, valid({ type: 'Outro' })), 'type');
    await assertField(
      service.create(1, valid({ danceClassIds: [] })),
      'danceClassIds',
    );
    await assertField(
      service.create(1, valid({ danceClassIds: ['abc'] })),
      'danceClassIds',
    );
    await assertField(
      service.create(1, valid({ danceClassIds: undefined })),
      'danceClassIds',
    );
  });

  it('rejeita turma inexistente ou inativa', async () => {
    await assertField(
      service.create(1, valid({ danceClassIds: [CLASS_A, MISSING_CLASS] })),
      'danceClassIds',
    );
  });

  it('não grava nem envia nada quando a validação falha', async () => {
    await assert.rejects(service.create(1, {}));

    assert.equal(repo.notices.size, 0);
    assert.equal(sent.length, 0);
  });
});

describe('NoticeService.list e remove', () => {
  it('lista os avisos, do mais recente ao mais antigo', async () => {
    await service.create(1, valid({ subject: 'Primeiro' }));
    await service.create(1, valid({ subject: 'Segundo' }));

    const result = await service.list();

    assert.deepEqual(
      result.map((notice) => notice.subject),
      ['Segundo', 'Primeiro'],
    );
  });

  it('"excluir" arquiva: some da lista e o registro é preservado', async () => {
    const created = await service.create(1, valid());

    await service.remove(created.id);

    assert.deepEqual(await service.list(), []);
    assert.equal(repo.notices.has(created.id), true);
  });

  it('valida o identificador e retorna 404 para inexistente ou já arquivado', async () => {
    await assert.rejects(service.remove('abc'), (e) => e.statusCode === 400);
    await assert.rejects(
      service.remove(MISSING_CLASS),
      (e) => e.statusCode === 404 && e.code === 'NOTICE_NOT_FOUND',
    );

    const created = await service.create(1, valid());
    await service.remove(created.id);

    await assert.rejects(
      service.remove(created.id),
      (e) => e.statusCode === 404,
    );
  });
});
