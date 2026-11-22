import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { errorHandler } from '../src/middlewares/error.middleware.js';
import { AppError } from '../src/utils/app-error.js';

function run(error) {
  const result = {};
  const res = {
    status(code) {
      result.status = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
  };

  errorHandler(error, {}, res, () => {});

  return result;
}

describe('errorHandler', () => {
  it('responde AppError com código, mensagem e campos', () => {
    const { status, body } = run(
      new AppError(400, 'VALIDATION_ERROR', 'Inválido.', { name: 'x' }),
    );

    assert.equal(status, 400);
    assert.deepEqual(body, {
      error: 'VALIDATION_ERROR',
      message: 'Inválido.',
      fields: { name: 'x' },
    });
  });

  it('responde 413 quando o corpo é grande demais', () => {
    const { status, body } = run(
      Object.assign(new Error('too large'), { type: 'entity.too.large' }),
    );

    assert.equal(status, 413);
    assert.equal(body.error, 'PAYLOAD_TOO_LARGE');
  });

  it('responde 400 para JSON malformado', () => {
    const { status, body } = run(
      Object.assign(new SyntaxError('bad'), { type: 'entity.parse.failed' }),
    );

    assert.equal(status, 400);
    assert.equal(body.error, 'INVALID_JSON');
  });

  it('responde 500 genérico para erros inesperados', () => {
    const original = console.error;
    console.error = () => {};

    try {
      const { status, body } = run(new Error('boom'));

      assert.equal(status, 500);
      assert.equal(body.error, 'INTERNAL_SERVER_ERROR');
    } finally {
      console.error = original;
    }
  });
});
