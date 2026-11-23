import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import { test } from 'node:test';
import { productListRateLimit } from '../src/middlewares/rate-limit.middleware.js';

test('pula o limite em desenvolvimento e mantém o limite em produção', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const app = express();

  app.get('/list', productListRateLimit, (_req, res) => {
    res.sendStatus(200);
  });

  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  try {
    const { port } = server.address();
    const url = `http://127.0.0.1:${port}/list`;

    process.env.NODE_ENV = 'development';

    for (let request = 0; request < 101; request += 1) {
      const response = await fetch(url);
      assert.equal(response.status, 200);
    }

    process.env.NODE_ENV = 'production';

    for (let request = 0; request < 100; request += 1) {
      const response = await fetch(url);
      assert.equal(response.status, 200);
    }

    const limitedResponse = await fetch(url);
    assert.equal(limitedResponse.status, 429);
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
