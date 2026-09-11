import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function createAccessToken(userId) {
  return jwt.sign(
    {},
    env.jwtAccessSecret,
    {
      subject: String(userId),
      expiresIn: env.accessTokenExpiresIn,
    },
  );
}

export function generateOpaqueToken() {
  return crypto.randomBytes(48).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createSessionExpiration() {
  return new Date(
    Date.now() + env.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
  );
}

export function createResetExpiration() {
  return new Date(
    Date.now() + env.resetTokenExpiresMinutes * 60 * 1000,
  );
}
