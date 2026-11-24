import { AppError } from './app-error.js';

const IMAGE_PATTERN = /^https?:\/\/\S+$/;

// Valida uma lista opcional de URLs de imagem. Retorna undefined quando o
// campo não foi enviado, ou a lista normalizada. Erros vão em `fields`.
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
      !IMAGE_PATTERN.test(item)
    ) {
      fields[field] =
        'Cada imagem deve ser uma URL. Envie arquivos pelo endpoint de upload.';
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
