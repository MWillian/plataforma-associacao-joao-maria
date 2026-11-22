import assert from 'node:assert/strict';
<<<<<<< HEAD
import { describe, it } from 'node:test';

import { NewsService } from '../src/services/news.service.js';

const UUID = '00000000-0000-4000-8000-000000000123';

describe('NewsService', () => {
  it('valida e cria uma notícia', async () => {
    let received;
    const service = new NewsService({
      create: async (data) => {
        received = data;
        return { id: UUID, ...data };
      },
    });

    const result = await service.create({
      title: '  Festival  ',
      description: '  Apresentações  ',
      publicationArea: 'studio',
      images: ['https://example.com/news.jpg'],
    });

    assert.deepEqual(received, {
      title: 'Festival',
      description: 'Apresentações',
      publicationArea: 'STUDIO',
      published: true,
      images: ['https://example.com/news.jpg'],
    });
    assert.equal(result.id, UUID);
  });

  it('rejeita área inválida', async () => {
    const service = new NewsService({});

    await assert.rejects(
      service.create({ title: 'Teste', publicationArea: 'eventos' }),
      (error) => error.statusCode === 400,
=======
import { beforeEach, describe, it } from 'node:test';

import { NewsService } from '../src/services/news.service.js';

const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const MISSING_ID = uuid(999);
const DATA_URL = 'data:image/png;base64,iVBORw0KGgo=';

class FakeNewsRepository {
  constructor() {
    this.rows = new Map();
    this.sequence = 0;
  }

  withImages(row) {
    return { ...row };
  }

  async listPublished() {
    return [...this.rows.values()]
      .filter((row) => row.published)
      .reverse()
      .map((row) => this.withImages(row));
  }

  async findById(id) {
    return this.rows.has(id) ? this.withImages(this.rows.get(id)) : null;
  }

  async create({ images = [], ...data }) {
    this.sequence += 1;
    const row = {
      id: uuid(this.sequence),
      published: true,
      createdAt: new Date('2026-11-21T12:00:00Z'),
      updatedAt: new Date('2026-11-21T12:00:00Z'),
      images: images.map((url) => ({ url })),
      ...data,
    };

    this.rows.set(row.id, row);

    return this.withImages(row);
  }

  async update(id, { images, ...data }) {
    const row = this.rows.get(id);

    if (!row) {
      return null;
    }

    Object.assign(row, data);

    if (images) {
      row.images = images.map((url) => ({ url }));
    }

    return this.withImages(row);
  }

  async unpublish(id) {
    const row = this.rows.get(id);

    if (!row) {
      return null;
    }

    row.published = false;

    return this.withImages(row);
  }
}

let repo;
let service;

beforeEach(() => {
  repo = new FakeNewsRepository();
  service = new NewsService(repo);
});

const valid = (overrides = {}) => ({
  title: 'Festival de Dança 2026',
  description: 'Inscrições abertas.',
  publicationArea: 'studio',
  images: [DATA_URL],
  ...overrides,
});

async function assertField(promise, field) {
  await assert.rejects(promise, (error) => {
    assert.equal(error.statusCode, 400);
    assert.ok(error.fields?.[field], `esperava erro em ${field}`);
    return true;
  });
}

describe('NewsService.create', () => {
  it('cria a notícia no formato do front', async () => {
    const result = await service.create(valid({ title: '  Festival  ' }));

    assert.equal(result.title, 'Festival');
    assert.equal(result.publicationArea, 'studio');
    assert.deepEqual(result.images, [DATA_URL]);
    assert.equal(result.description, 'Inscrições abertas.');
  });

  it('aceita notícia sem descrição e sem imagens (descrição vira texto vazio)', async () => {
    const result = await service.create(
      valid({ description: undefined, images: undefined }),
    );

    assert.equal(result.description, '');
    assert.deepEqual(result.images, []);
  });

  it('aceita as três áreas do front', async () => {
    for (const area of ['studio', 'crafts', 'agriculture', 'CRAFTS']) {
      const result = await service.create(valid({ publicationArea: area }));

      assert.equal(result.publicationArea, area.toLowerCase());
    }
  });

  it('valida título, área e imagens', async () => {
    await assertField(service.create(valid({ title: '  ' })), 'title');
    await assertField(
      service.create(valid({ publicationArea: undefined })),
      'publicationArea',
    );
    await assertField(
      service.create(valid({ publicationArea: 'home' })),
      'publicationArea',
    );
    await assertField(
      service.create(valid({ images: ['arquivo.exe'] })),
      'images',
    );
    await assertField(
      service.create(valid({ images: Array(11).fill(DATA_URL) })),
      'images',
    );
    await assertField(
      service.create(valid({ description: 123 })),
      'description',
    );
  });

  it('não grava nada quando a validação falha', async () => {
    await assert.rejects(service.create({}));

    assert.equal(repo.rows.size, 0);
  });
});

describe('NewsService.list', () => {
  it('lista só as publicadas, da mais recente para a mais antiga', async () => {
    const first = await service.create(valid({ title: 'Primeira' }));
    await service.create(valid({ title: 'Segunda' }));
    await service.unpublish(first.id);
    await service.create(valid({ title: 'Terceira' }));

    const result = await service.list();

    assert.deepEqual(
      result.map((item) => item.title),
      ['Terceira', 'Segunda'],
    );
  });
});

describe('NewsService.update', () => {
  it('atualiza e troca as imagens quando enviadas', async () => {
    const created = await service.create(valid());

    const result = await service.update(
      created.id,
      valid({ title: 'Novo título', images: [] }),
    );

    assert.equal(result.title, 'Novo título');
    assert.deepEqual(result.images, []);
  });

  it('mantém as imagens quando o campo não é enviado', async () => {
    const created = await service.create(valid());

    const result = await service.update(
      created.id,
      valid({ images: undefined }),
    );

    assert.deepEqual(result.images, [DATA_URL]);
  });

  it('valida o identificador e os dados', async () => {
    await assert.rejects(service.update('abc', valid()), (e) => e.statusCode === 400);
    const created = await service.create(valid());
    await assertField(
      service.update(created.id, valid({ title: '' })),
      'title',
    );
  });

  it('retorna 404 para notícia inexistente ou despublicada', async () => {
    await assert.rejects(
      service.update(MISSING_ID, valid()),
      (e) => e.statusCode === 404 && e.code === 'NEWS_NOT_FOUND',
    );

    const created = await service.create(valid());
    await service.unpublish(created.id);

    await assert.rejects(
      service.update(created.id, valid()),
      (e) => e.statusCode === 404,
    );
  });
});

describe('NewsService.unpublish', () => {
  it('despublica sem apagar o registro', async () => {
    const created = await service.create(valid());

    await service.unpublish(created.id);

    assert.equal(repo.rows.has(created.id), true);
    assert.deepEqual(await service.list(), []);
  });

  it('é idempotente', async () => {
    const created = await service.create(valid());

    await service.unpublish(created.id);
    const result = await service.unpublish(created.id);

    assert.equal(result.id, created.id);
  });

  it('retorna 400 para id inválido e 404 para inexistente', async () => {
    await assert.rejects(service.unpublish('abc'), (e) => e.statusCode === 400);
    await assert.rejects(
      service.unpublish(MISSING_ID),
      (e) => e.statusCode === 404 && e.code === 'NEWS_NOT_FOUND',
    );
  });

  it('retorna 404 se a notícia sumir durante a operação', async () => {
    const created = await service.create(valid());
    repo.unpublish = async () => null;

    await assert.rejects(
      service.unpublish(created.id),
      (e) => e.statusCode === 404,
>>>>>>> origin/main
    );
  });
});
