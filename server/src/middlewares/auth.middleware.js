import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization;

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

  try {
    const payload = jwt.verify(
      token,
      env.jwtAccessSecret,
    );

    if (!payload.sub) {
      throw new Error('JWT sem subject.');
    }

    req.auth = {
      userId: Number(payload.sub),
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
