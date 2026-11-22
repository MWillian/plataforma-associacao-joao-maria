import { AppError } from './app-error.js';

// Aceita imagem como data URL (o front envia o arquivo em base64) ou URL.
const IMAGE_PATTERN =
  /^(data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+|https?:\/\/\S+)$/;

// ~6 MB de imagem em base64.
export const MAX_IMAGE_LENGTH = 8_000_000;

// Valida uma lista opcional de imagens (strings). Retorna undefined quando
// o campo não foi enviado, ou a lista normalizada. Erros vão em `fields`.
export function validateImages(
  value,
  { max, field = 'images' },
  fields,
) {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    fields[field] = 'As imagens devem ser uma lista.';
    return undefined;
  }

  if (value.length > max) {
    fields[field] = `Envie no máximo ${max} imagens.`;
    return undefined;
  }

  const urls = [];

  for (const item of value) {
    if (
      typeof item !== 'string' ||
      item.length > MAX_IMAGE_LENGTH ||
      !IMAGE_PATTERN.test(item)
    ) {
      fields[field] =
        'Cada imagem deve ser um arquivo de imagem (até ~6 MB) ou um link válido.';
      return undefined;
    }

    urls.push(item);
  }

  return urls;
}

export function throwValidation(fields, message) {
  if (Object.keys(fields).length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', message, fields);
  }
}
