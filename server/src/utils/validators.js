export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '');
}

// Aceita telefone brasileiro com DDD (10 ou 11 dígitos), com ou sem máscara.
// Retorna apenas os dígitos, ou null se o valor for inválido.
export function normalizePhone(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const digits = digitsOnly(value);

  if (!/^[1-9][1-9]\d{8,9}$/.test(digits)) {
    return null;
  }

  // Celular (11 dígitos) começa com 9 após o DDD.
  if (digits.length === 11 && digits[2] !== '9') {
    return null;
  }

  return digits;
}

// Retorna o e-mail em minúsculas, ou null se for inválido.
export function normalizeEmail(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const email = value.trim().toLowerCase();

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return null;
  }

  return email;
}
