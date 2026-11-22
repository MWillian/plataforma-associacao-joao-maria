import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  normalizeEmail,
  normalizePhone,
} from '../src/utils/validators.js';

describe('normalizePhone', () => {
  it('normaliza celular e fixo com ou sem máscara', () => {
    assert.equal(normalizePhone('(82) 99999-9999'), '82999999999');
    assert.equal(normalizePhone('8233334444'), '8233334444');
  });

  for (const invalid of [
    '82 89999-9999',
    '0199999999',
    '999999999',
    '829999999999',
    '',
    null,
    undefined,
    82999999999,
  ]) {
    it(`rejeita telefone inválido: ${String(invalid)}`, () => {
      assert.equal(normalizePhone(invalid), null);
    });
  }
});

describe('normalizeEmail', () => {
  it('normaliza para minúsculas e remove espaços', () => {
    assert.equal(
      normalizeEmail('  Maria@Example.COM '),
      'maria@example.com',
    );
  });

  for (const invalid of ['maria', 'maria@', '@x.com', 'a b@x.com', '', null, 10]) {
    it(`rejeita e-mail inválido: ${String(invalid)}`, () => {
      assert.equal(normalizeEmail(invalid), null);
    });
  }
});
