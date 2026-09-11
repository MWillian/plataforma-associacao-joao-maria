import 'dotenv/config';

function required(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}`,
    );
  }

  return value;
}

function booleanEnv(value, fallback = false) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return fallback;
  }

  const normalizedValue = String(value)
    .trim()
    .toLowerCase();

  if (!['true', 'false'].includes(normalizedValue)) {
    throw new Error(
      'COOKIE_SECURE deve ser true ou false.',
    );
  }

  return normalizedValue === 'true';
}

function numberEnv(name, fallback) {
  const rawValue = process.env[name];

  if (rawValue === undefined || rawValue === '') {
    return fallback;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `Variável de ambiente inválida: ${name}`,
    );
  }

  return value;
}

function sameSiteEnv(value) {
  const normalizedValue = String(value ?? 'lax')
    .trim()
    .toLowerCase();

  const allowedValues = [
    'lax',
    'strict',
    'none',
  ];

  if (!allowedValues.includes(normalizedValue)) {
    throw new Error(
      'COOKIE_SAME_SITE deve ser lax, strict ou none.',
    );
  }

  return normalizedValue;
}

const nodeEnv =
  process.env.NODE_ENV?.trim() || 'development';

export const env = {
  nodeEnv,

  port: numberEnv('PORT', 3001),

  frontendUrl:
    process.env.FRONTEND_URL?.trim() ||
    'http://localhost:5173',

  jwtAccessSecret: required('JWT_ACCESS_SECRET'),

  accessTokenExpiresIn:
    process.env.ACCESS_TOKEN_EXPIRES_IN?.trim() ||
    '15m',

  refreshTokenExpiresDays: numberEnv(
    'REFRESH_TOKEN_EXPIRES_DAYS',
    7,
  ),

  resetTokenExpiresMinutes: numberEnv(
    'RESET_TOKEN_EXPIRES_MINUTES',
    30,
  ),

  cookieSecure: booleanEnv(
    process.env.COOKIE_SECURE,
    nodeEnv === 'production',
  ),

  cookieSameSite: sameSiteEnv(
    process.env.COOKIE_SAME_SITE,
  ),

  resendApiKey:
    process.env.RESEND_API_KEY?.trim() || '',

  resendFrom:
    process.env.RESEND_FROM?.trim() ||
    'Studio Adágio <no-reply@example.com>',

  // Conta autorizada a acessar as rotas administrativas.
  adminEmail: required('ADMIN_EMAIL')
    .toLowerCase(),
};
