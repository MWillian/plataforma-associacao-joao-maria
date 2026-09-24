import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ProductService } from '../src/services/product.service.js';

const PRODUCT_ID =
  'f7efb2aa-84cd-4b3c-919c-e20ab5c4f9d6';

function createRepository(overrides = {}) {
  return {
    findByTitle: async () => null,
    create: async (data) => ({ id: PRODUCT_ID, ...data }),
    ...overrides,
  };
}

describe('ProductService.create', () => {
  it('normaliza e cadastra um produto', async () => {
    let receivedData;
    const service = new ProductService(
      createRepository({
        create: async (data) => {
          receivedData = data;
          return { id: PRODUCT_ID, ...data };
        },
      }),
    );

    const result = await service.create({
      title: '  CESTA DE PALHA  ',
      category: ' ARTESANATO ',
      description: '  Feita à mão.  ',
      imageUrl: ' https://example.com/cesta.jpg ',
    });

    assert.deepEqual(receivedData, {
      title: 'cesta de palha',
      category: 'artesanato',
      description: 'Feita à mão.',
      imageUrl: 'https://example.com/cesta.jpg',
      active: true,
    });
    assert.equal(result.id, PRODUCT_ID);
  });

  it('rejeita título ausente', async () => {
    const service = new ProductService(createRepository());

    await assert.rejects(
      () => service.create({ category: 'agricultura' }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('rejeita categoria inválida', async () => {
    const service = new ProductService(createRepository());

    await assert.rejects(
      () =>
        service.create({
          title: 'Milho',
          category: 'outros',
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('rejeita active que não seja booleano', async () => {
    const service = new ProductService(createRepository());

    await assert.rejects(
      () =>
        service.create({
          title: 'Milho',
          category: 'agricultura',
          active: 'true',
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('rejeita título já cadastrado', async () => {
    const service = new ProductService(
      createRepository({
        findByTitle: async () => ({ id: PRODUCT_ID }),
      }),
    );

    await assert.rejects(
      () =>
        service.create({
          title: 'Cesta de palha',
          category: 'artesanato',
        }),
      {
        statusCode: 409,
        code: 'PRODUCT_ALREADY_EXISTS',
      },
    );
  });

  it('converte conflito de unicidade do Prisma em 409', async () => {
    const prismaConflict = new Error('Unique constraint');
    prismaConflict.code = 'P2002';

    const service = new ProductService(
      createRepository({
        create: async () => {
          throw prismaConflict;
        },
      }),
    );

    await assert.rejects(
      () =>
        service.create({
          title: 'Cesta de palha',
          category: 'artesanato',
        }),
      {
        statusCode: 409,
        code: 'PRODUCT_ALREADY_EXISTS',
      },
    );
  });
});
