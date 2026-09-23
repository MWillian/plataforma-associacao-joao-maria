import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(env.port, () => {
  console.log(
    `API executando em http://localhost:${env.port}`,
  );
});

async function shutdown(signal) {
  console.log(
    `\n${signal} recebido. Encerrando aplicação...`,
  );

  const forceExitTimeout = setTimeout(() => {
    console.error('Encerramento forçado por tempo limite excedido.');
    process.exit(1);
  }, 10000);

  forceExitTimeout.unref();

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('uncaughtException', (error) => {
  console.error('Exceção não capturada:', error);
});

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
