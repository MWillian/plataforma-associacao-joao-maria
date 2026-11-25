import { AppError } from './app-error.js';

const IMAGE_PATTERN = /^https?:\/\/\S+$/;
const IMAGE_PUBLIC_ID_PATTERN =
  /^associacao\/(products|news)\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getCloudinaryPublicIdFromUrl(url, folder) {
  if (
    typeof url !== 'string' ||
    !['products', 'news'].includes(folder)
  ) {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  if (
    parsedUrl.protocol !== 'https:' ||
    parsedUrl.hostname !== 'res.cloudinary.com'
  ) {
    return null;
  }

  const segments = parsedUrl.pathname.split('/').filter(Boolean);
  const uploadIndex = segments.findIndex(
    (segment, index) =>
      segment === 'image' && segments[index + 1] === 'upload',
  );
  const folderIndex = segments.findIndex(
    (segment, index) =>
      segment === 'associacao' && segments[index + 1] === folder,
  );

  if (
    uploadIndex < 0 ||
    folderIndex <= uploadIndex + 1 ||
    segments.length !== folderIndex + 3
  ) {
    return null;
  }

  const filename = segments[folderIndex + 2];
  const publicId = filename.replace(/\.[^.]+$/, '');
  const candidate = `associacao/${folder}/${publicId}`;

  return IMAGE_PUBLIC_ID_PATTERN.test(candidate) ? candidate : null;
}

// Retorna URLs e Cloudinary public IDs, inferindo IDs de uploads antigos.
export function validateImages(
  value,
  { max, field = 'images', folder },
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

  const images = [];

  for (const item of value) {
    const url = typeof item === 'string' ? item : item?.url;

    if (
      typeof url !== 'string' ||
      !IMAGE_PATTERN.test(url)
    ) {
      fields[field] =
        'Cada imagem deve ser uma URL. Envie arquivos pelo endpoint de upload.';
      return undefined;
    }

    const inferredPublicId = getCloudinaryPublicIdFromUrl(url, folder);
    const suppliedPublicId =
      typeof item === 'object' && item !== null
        ? item.publicId
        : undefined;

    if (
      suppliedPublicId !== undefined &&
      suppliedPublicId !== null &&
      (
        typeof suppliedPublicId !== 'string' ||
        !IMAGE_PUBLIC_ID_PATTERN.test(suppliedPublicId) ||
        (folder &&
          !suppliedPublicId.startsWith(`associacao/${folder}/`)) ||
        !inferredPublicId ||
        suppliedPublicId !== inferredPublicId
      )
    ) {
      fields[field] = 'O identificador de uma imagem é inválido.';
      return undefined;
    }

    images.push({
      url,
      ...((suppliedPublicId ?? inferredPublicId) && {
        publicId: suppliedPublicId ?? inferredPublicId,
      }),
    });
  }

  return images;
}

export function throwValidation(fields, message) {
  if (Object.keys(fields).length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', message, fields);
  }
}
