import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/app-error.js';

export function requireAuth(req, _res, next) {
  const authorization =
    req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return next(
      new AppError(
        401,
        'UNAUTHORIZED',
        'Autenticação necessária.',
      ),
    );
  }

  const token = authorization
    .slice('Bearer '.length)
    .trim();

  if (!token) {
    return next(
      new AppError(
        401,
        'UNAUTHORIZED',
        'Autenticação necessária.',
      ),
    );
  }

  try {
    const payload = jwt.verify(
      token,
      env.jwtAccessSecret,
    );

    const userId = Number(payload.sub);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error(
        'JWT com identificador inválido.',
      );
    }

    req.auth = {
      userId,
    };

    return next();
  } catch {
    return next(
      new AppError(
        401,
        'UNAUTHORIZED',
        'Autenticação necessária.',
      ),
    );
  }
}

export async function requireAdmin(
  req,
  _res,
  next,
) {
  try {
    if (!req.auth?.userId) {
      return next(
        new AppError(
          401,
          'UNAUTHORIZED',
          'Autenticação necessária.',
        ),
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.auth.userId,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (
      !user ||
      user.email.trim().toLowerCase() !==
        env.adminEmail
    ) {
      return next(
        new AppError(
          403,
          'FORBIDDEN',
          'Acesso restrito à administração.',
        ),
      );
    }

    req.auth.isAdmin = true;

    return next();
  } catch (error) {
    return next(error);
  }
}
