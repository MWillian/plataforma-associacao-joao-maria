import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

if (!process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_ACCESS_SECRET = 'test-jwt-secret';
}

const { createEmailService } = await import('../src/services/email.service.js');

describe('EmailService Resend', () => {
  it('considera o serviço sem configuração quando falta chave ou remetente', async () => {
    const service = createEmailService({
      apiKey: '',
      from: '',
      client: { emails: { send: async () => ({ data: { id: 'ignored' } }) } },
    });

    assert.equal(service.isEmailConfigured(), false);
    await assert.rejects(
      service.sendNoticeEmail({
        email: 'responsavel@example.com',
        subject: 'Aviso',
        message: 'Mensagem',
      }),
      /RESEND_API_KEY e RESEND_FROM/,
    );
  });

  it('envia template com mensagem escapada e logo inline', async () => {
    let request;
    const service = createEmailService({
      apiKey: 're_test_key',
      from: 'Associação <avisos@example.com>',
      client: {
        emails: {
          send: async (payload) => {
            request = payload;
            return { data: { id: 'email-id' }, error: null };
          },
        },
      },
    });

    await service.sendNoticeEmail({
      email: 'responsavel@example.com',
      subject: 'Aviso da turma',
      message: '<script>alert("x")</script>\nA & B',
    });

    assert.equal(request.from, 'Associação <avisos@example.com>');
    assert.equal(request.to, 'responsavel@example.com');
    assert.equal(request.subject, 'Aviso da turma');
    assert.match(request.html, /<title>Aviso da turma<\/title>/);
    assert.match(request.html, /src="cid:associacao-joao-maria-logo"/);
    assert.match(
      request.html,
      /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;<br \/>A &amp; B/,
    );
    assert.equal(
      request.text,
      'Aviso da turma\n\n<script>alert("x")</script>\nA & B\n\nAssociação Comunitária João Maria · Coruripe, AL',
    );
    assert.equal(request.attachments.length, 1);
    assert.equal(request.attachments[0].filename, 'logo-joao-maria.png');
    assert.equal(
      request.attachments[0].contentId,
      'associacao-joao-maria-logo',
    );
    assert.ok(Buffer.isBuffer(request.attachments[0].content));
    assert.ok(request.attachments[0].content.length > 0);
  });

  it('propaga erros retornados pela API do Resend', async () => {
    const service = createEmailService({
      apiKey: 're_test_key',
      from: 'avisos@example.com',
      client: {
        emails: {
          send: async () => ({
            data: null,
            error: { message: 'Domínio não verificado.' },
          }),
        },
      },
    });

    await assert.rejects(
      service.sendNoticeEmail({
        email: 'responsavel@example.com',
        subject: 'Aviso',
        message: 'Mensagem',
      }),
      /Domínio não verificado/,
    );
  });

  it('não registra sucesso se o Resend não retornar um identificador', async () => {
    const service = createEmailService({
      apiKey: 're_test_key',
      from: 'avisos@example.com',
      client: { emails: { send: async () => ({ data: null, error: null }) } },
    });

    await assert.rejects(
      service.sendNoticeEmail({
        email: 'responsavel@example.com',
        subject: 'Aviso',
        message: 'Mensagem',
      }),
      /não confirmou o envio/,
    );
  });
});
