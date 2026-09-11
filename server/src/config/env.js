import 'dotenv/config';

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }

  return value;
}

function booleanEnv(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return String(value).toLowerCase() === 'true';
}

function numberEnv(name, fallback) {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue === '') {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: numberEnv('PORT', 3001),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',

  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  refreshTokenExpiresDays: numberEnv('REFRESH_TOKEN_EXPIRES_DAYS', 7),
  resetTokenExpiresMinutes: numberEnv('RESET_TOKEN_EXPIRES_MINUTES', 30),

  cookieSecure: booleanEnv(
    process.env.COOKIE_SECURE,
    (process.env.NODE_ENV ?? 'development') === 'production',
  ),
  cookieSameSite: process.env.COOKIE_SAME_SITE ?? 'lax',

  resendApiKey: process.env.RESEND_API_KEY ?? '',
  resendFrom: process.env.RESEND_FROM ?? 'Studio Adágio <no-reply@example.com>',
};
