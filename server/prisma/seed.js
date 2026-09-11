import 'dotenv/config';

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL
  ?.trim()
  .toLowerCase();

const password = process.env.ADMIN_PASSWORD;
const name =
  process.env.ADMIN_NAME ?? 'Administradora';

if (!email || !password) {
  throw new Error(
    'Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env antes de executar o seed.',
  );
}

if (password.length < 8) {
  throw new Error(
    'ADMIN_PASSWORD deve possuir pelo menos 8 caracteres.',
  );
}

try {
  const passwordHash = await bcrypt.hash(
    password,
    12,
  );

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      refreshTokenHash: null,
      sessionExpiresAt: null,
    },
    create: {
      email,
      name,
      passwordHash,
    },
  });

  console.log(
    `Usuário administrativo preparado: ${email}`,
  );
} finally {
  await prisma.$disconnect();
}
