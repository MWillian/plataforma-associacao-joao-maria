import assert from 'node:assert/strict';
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
    );
  });
});
