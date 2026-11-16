import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/app-error.js';
import {
  createAccessToken,
  createSessionExpiration,
  generateOpaqueToken,
  hashToken,
} from '../utils/tokens.js';

const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
};

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

function validateLoginInput(email, password) {
  const fields = {};

  if (!email) {
    fields.email = 'E-mail é obrigatório.';
  }

  if (!password) {
    fields.password = 'Senha é obrigatória.';
  }

  if (Object.keys(fields).length > 0) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Dados de autenticação inválidos.',
      fields,
    );
  }
}

export async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  validateLoginInput(normalizedEmail, password);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
      active: true,
    },
  });

  const dummyHash = '$2a$12$R9h/cIPz0gi.URNNX3ch2OS0Fs0vnjO9D.N5Z.K9X.A5h.A.A.A.A';

  const validPassword = await bcrypt.compare(password, user?.passwordHash || dummyHash);

  if (!user || !validPassword) {
    throw new AppError(
      401,
      'INVALID_CREDENTIALS',
      'E-mail ou senha inválidos.',
    );
  }

  const refreshToken = generateOpaqueToken();
  const sessionExpiresAt = createSessionExpiration();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash: hashToken(refreshToken),
      sessionExpiresAt,
    },
  });

  const publicUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: PUBLIC_USER_SELECT,
  });

  return {
    user: publicUser,
    accessToken: createAccessToken(user.id),
    refreshToken,
    sessionExpiresAt,
  };
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw new AppError(
      401,
      'SESSION_EXPIRED',
      'Sessão expirada. Faça login novamente.',
    );
  }

  const now = new Date();

  const user = await prisma.user.findFirst({
    where: {
      refreshTokenHash: hashToken(refreshToken),
      sessionExpiresAt: { gt: now },
    },
  });

  if (!user?.sessionExpiresAt) {
    throw new AppError(
      401,
      'SESSION_EXPIRED',
      'Sessão expirada. Faça login novamente.',
    );
  }

  // Rotação: o Refresh Token apresentado deixa de ser válido.
  // A sessão NÃO ganha mais 7 dias; mantém a expiração do login original.
  const newRefreshToken = generateOpaqueToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash: hashToken(newRefreshToken),
    },
  });

  return {
    accessToken: createAccessToken(user.id),
    refreshToken: newRefreshToken,
    sessionExpiresAt: user.sessionExpiresAt,
  };
}

export async function logout(refreshToken) {
  if (!refreshToken) {
    return;
  }

  await prisma.user.updateMany({
    where: {
      refreshTokenHash: hashToken(refreshToken),
    },
    data: {
      refreshTokenHash: null,
      sessionExpiresAt: null,
    },
  });
}

