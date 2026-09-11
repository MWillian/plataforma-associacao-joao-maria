import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/app-error.js';
import {
  createAccessToken,
  createResetExpiration,
  createSessionExpiration,
  generateOpaqueToken,
  hashToken,
} from '../utils/tokens.js';
import { sendPasswordResetEmail } from './email.service.js';

const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
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

function validateNewPassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'A nova senha deve possuir pelo menos 8 caracteres.',
      {
        password: 'Informe uma senha com pelo menos 8 caracteres.',
      },
    );
  }
}

export async function login({ email, password }) {
  const normalizedEmail = normalizeEmail(email);

  validateLoginInput(normalizedEmail, password);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // A API não diferencia "usuário inexistente" de "senha incorreta".
  const validPassword =
    user?.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

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

export async function forgotPassword(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'E-mail é obrigatório.',
      {
        email: 'E-mail é obrigatório.',
      },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Evita revelar se determinado e-mail está cadastrado.
  if (!user) {
    return;
  }

  const resetToken = generateOpaqueToken();
  const passwordResetExpiresAt = createResetExpiration();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetTokenHash: hashToken(resetToken),
      passwordResetExpiresAt,
    },
  });

  await sendPasswordResetEmail({
    email: normalizedEmail,
    token: resetToken,
  });
}

export async function resetPassword({ token, password }) {
  if (!token) {
    throw new AppError(
      400,
      'INVALID_OR_EXPIRED_RESET_TOKEN',
      'O link de recuperação é inválido ou expirou.',
    );
  }

  validateNewPassword(password);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(
      400,
      'INVALID_OR_EXPIRED_RESET_TOKEN',
      'O link de recuperação é inválido ou expirou.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,

      // Trocar a senha encerra qualquer sessão autenticada existente.
      refreshTokenHash: null,
      sessionExpiresAt: null,
    },
  });
}
