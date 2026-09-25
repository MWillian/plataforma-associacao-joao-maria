import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ProductService } from '../src/services/product.service.js';

const PRODUCT_ID =
  'f7efb2aa-84cd-4b3c-919c-e20ab5c4f9d6';

function createRepository(overrides = {}) {
  return {
    listActiveHighlights: async () => [],
    listActive: async () => ({
      items: [],
      totalItems: 0,
    }),
    findByTitle: async () => null,
    create: async (data) => ({ id: PRODUCT_ID, ...data }),
    findById: async () => ({
      id: PRODUCT_ID,
      active: true,
    }),
    inactivate: async () => ({
      id: PRODUCT_ID,
      active: false,
    }),
    activate: async () => ({
      id: PRODUCT_ID,
      active: true,
    }),
    update: async (id, data) => ({
      id,
      active: true,
      ...data,
    }),
    ...overrides,
  };
}

describe('ProductService.listHighlights', () => {
  it('lista até 3 produtos ativos da agricultura', async () => {
    let receivedCategory;
    const items = [
      {
        id: PRODUCT_ID,
        title: 'mel',
        category: 'agricultura',
        active: true,
      },
    ];
    const service = new ProductService(
      createRepository({
        listActiveHighlights: async (category) => {
          receivedCategory = category;
          return items;
        },
      }),
    );

    const result = await service.listHighlights({
      category: ' AGRICULTURA ',
    });

    assert.equal(receivedCategory, 'agricultura');
    assert.deepEqual(result, {
      items,
      category: 'agricultura',
      limit: 3,
    });
  });

  it('lista até 3 produtos ativos do artesanato', async () => {
    let receivedCategory;
    const service = new ProductService(
      createRepository({
        listActiveHighlights: async (category) => {
          receivedCategory = category;
          return [];
        },
      }),
    );

    const result = await service.listHighlights({
      category: 'artesanato',
    });

    assert.equal(receivedCategory, 'artesanato');
    assert.equal(result.category, 'artesanato');
    assert.equal(result.limit, 3);
  });

  it('rejeita listagem sem categoria', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () => service.listHighlights(),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('rejeita categoria diferente das permitidas', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () =>
        service.listHighlights({
          category: 'outros',
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });
});

describe('ProductService.list', () => {
  it('lista a primeira página com 10 produtos por padrão', async () => {
    let receivedPagination;
    const items = [
      {
        id: PRODUCT_ID,
        title: 'mel',
        active: true,
      },
    ];
    const service = new ProductService(
      createRepository({
        listActive: async (pagination) => {
          receivedPagination = pagination;
          return {
            items,
            totalItems: 21,
          };
        },
      }),
    );

    const result = await service.list();

    assert.deepEqual(receivedPagination, {
      skip: 0,
      take: 10,
    });
    assert.deepEqual(result, {
      items,
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 21,
        totalPages: 3,
      },
    });
  });

  it('calcula o deslocamento da página solicitada', async () => {
    let receivedPagination;
    const service = new ProductService(
      createRepository({
        listActive: async (pagination) => {
          receivedPagination = pagination;
          return {
            items: [],
            totalItems: 25,
          };
        },
      }),
    );

    const result = await service.list({
      page: '3',
    });

    assert.deepEqual(receivedPagination, {
      skip: 20,
      take: 10,
    });
    assert.equal(result.pagination.page, 3);
    assert.equal(result.pagination.totalPages, 3);
  });

  it('retorna paginação vazia quando não há produtos ativos', async () => {
    const service = new ProductService(
      createRepository(),
    );

    const result = await service.list();

    assert.deepEqual(result, {
      items: [],
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
      },
    });
  });

  for (const invalidPage of [
    '0',
    '-1',
    '1.5',
    'abc',
    '',
    ['1', '2'],
  ]) {
    it(`rejeita página inválida: ${String(invalidPage)}`, async () => {
      const service = new ProductService(
        createRepository(),
      );

      await assert.rejects(
        () =>
          service.list({
            page: invalidPage,
          }),
        {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
        },
      );
    });
  }
});

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

describe('ProductService.update', () => {
  it('normaliza e atualiza um produto', async () => {
    let receivedId;
    let receivedData;
    const service = new ProductService(
      createRepository({
        update: async (id, data) => {
          receivedId = id;
          receivedData = data;
          return { id, active: true, ...data };
        },
      }),
    );

    const result = await service.update(PRODUCT_ID, {
      title: '  MEL ORGÂNICO  ',
      category: ' AGRICULTURA ',
      description: '  Produção local.  ',
      imageUrl: ' https://example.com/mel.jpg ',
    });

    assert.equal(receivedId, PRODUCT_ID);
    assert.deepEqual(receivedData, {
      title: 'mel orgânico',
      category: 'agricultura',
      description: 'Produção local.',
      imageUrl: 'https://example.com/mel.jpg',
    });
    assert.equal(result.title, 'mel orgânico');
  });

  it('rejeita identificador inválido na atualização', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () =>
        service.update('id-inválido', {
          title: 'Mel',
          category: 'agricultura',
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('retorna 404 ao atualizar produto inexistente', async () => {
    const service = new ProductService(
      createRepository({
        findById: async () => null,
      }),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          title: 'Mel',
          category: 'agricultura',
        }),
      {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      },
    );
  });

  it('rejeita atualização sem título', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          category: 'agricultura',
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('rejeita categoria inválida na atualização', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          title: 'Mel',
          category: 'outros',
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('não permite alterar active pela atualização', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          title: 'Mel',
          category: 'agricultura',
          active: false,
        }),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('permite manter o título do próprio produto', async () => {
    const service = new ProductService(
      createRepository({
        findByTitle: async () => ({ id: PRODUCT_ID }),
      }),
    );

    const result = await service.update(PRODUCT_ID, {
      title: 'Mel',
      category: 'agricultura',
    });

    assert.equal(result.title, 'mel');
  });

  it('rejeita título usado por outro produto', async () => {
    const service = new ProductService(
      createRepository({
        findByTitle: async () => ({
          id: 'd77d62d9-fade-486f-b2b0-b66540bd7723',
        }),
      }),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          title: 'Mel',
          category: 'agricultura',
        }),
      {
        statusCode: 409,
        code: 'PRODUCT_ALREADY_EXISTS',
      },
    );
  });

  it('converte conflito de unicidade na atualização em 409', async () => {
    const prismaConflict = new Error('Unique constraint');
    prismaConflict.code = 'P2002';
    const service = new ProductService(
      createRepository({
        update: async () => {
          throw prismaConflict;
        },
      }),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          title: 'Mel',
          category: 'agricultura',
        }),
      {
        statusCode: 409,
        code: 'PRODUCT_ALREADY_EXISTS',
      },
    );
  });

  it('retorna 404 se o produto desaparecer durante a atualização', async () => {
    const service = new ProductService(
      createRepository({
        update: async () => null,
      }),
    );

    await assert.rejects(
      () =>
        service.update(PRODUCT_ID, {
          title: 'Mel',
          category: 'agricultura',
        }),
      {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      },
    );
  });
});

describe('ProductService.inactivate', () => {
  it('inativa um produto ativo', async () => {
    let receivedId;
    const service = new ProductService(
      createRepository({
        inactivate: async (id) => {
          receivedId = id;
          return {
            id,
            active: false,
          };
        },
      }),
    );

    const result = await service.inactivate(PRODUCT_ID);

    assert.equal(receivedId, PRODUCT_ID);
    assert.equal(result.active, false);
  });

  it('rejeita identificador fora do formato UUID', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () => service.inactivate('id-inválido'),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('retorna 404 quando o produto não existe', async () => {
    const service = new ProductService(
      createRepository({
        findById: async () => null,
      }),
    );

    await assert.rejects(
      () => service.inactivate(PRODUCT_ID),
      {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      },
    );
  });

  it('não atualiza novamente um produto inativo', async () => {
    let updateCalled = false;
    const inactiveProduct = {
      id: PRODUCT_ID,
      active: false,
    };
    const service = new ProductService(
      createRepository({
        findById: async () => inactiveProduct,
        inactivate: async () => {
          updateCalled = true;
          return inactiveProduct;
        },
      }),
    );

    const result = await service.inactivate(PRODUCT_ID);

    assert.equal(updateCalled, false);
    assert.deepEqual(result, inactiveProduct);
  });

  it('retorna 404 se o produto desaparecer durante a operação', async () => {
    const service = new ProductService(
      createRepository({
        inactivate: async () => null,
      }),
    );

    await assert.rejects(
      () => service.inactivate(PRODUCT_ID),
      {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      },
    );
  });
});

describe('ProductService.activate', () => {
  it('ativa um produto inativo', async () => {
    let receivedId;
    const service = new ProductService(
      createRepository({
        findById: async () => ({
          id: PRODUCT_ID,
          active: false,
        }),
        activate: async (id) => {
          receivedId = id;
          return {
            id,
            active: true,
          };
        },
      }),
    );

    const result = await service.activate(PRODUCT_ID);

    assert.equal(receivedId, PRODUCT_ID);
    assert.equal(result.active, true);
  });

  it('rejeita identificador inválido na ativação', async () => {
    const service = new ProductService(
      createRepository(),
    );

    await assert.rejects(
      () => service.activate('id-inválido'),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      },
    );
  });

  it('retorna 404 ao ativar produto inexistente', async () => {
    const service = new ProductService(
      createRepository({
        findById: async () => null,
      }),
    );

    await assert.rejects(
      () => service.activate(PRODUCT_ID),
      {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      },
    );
  });

  it('não atualiza novamente um produto ativo', async () => {
    let updateCalled = false;
    const activeProduct = {
      id: PRODUCT_ID,
      active: true,
    };
    const service = new ProductService(
      createRepository({
        findById: async () => activeProduct,
        activate: async () => {
          updateCalled = true;
          return activeProduct;
        },
      }),
    );

    const result = await service.activate(PRODUCT_ID);

    assert.equal(updateCalled, false);
    assert.deepEqual(result, activeProduct);
  });

  it('retorna 404 se o produto desaparecer durante a ativação', async () => {
    const service = new ProductService(
      createRepository({
        findById: async () => ({
          id: PRODUCT_ID,
          active: false,
        }),
        activate: async () => null,
      }),
    );

    await assert.rejects(
      () => service.activate(PRODUCT_ID),
      {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      },
    );
  });
});
