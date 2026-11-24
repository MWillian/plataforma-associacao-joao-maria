import { randomUUID } from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/app-error.js';

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(['products', 'news']);
const IMAGE_SIGNATURES = [
  {
    format: 'jpeg',
    contentType: 'image/jpeg',
    matches: (buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  {
    format: 'png',
    contentType: 'image/png',
    matches: (buffer) =>
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
  },
  {
    format: 'gif',
    contentType: 'image/gif',
    matches: (buffer) =>
      buffer.length >= 6 &&
      ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6)),
  },
  {
    format: 'webp',
    contentType: 'image/webp',
    matches: (buffer) =>
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP',
  },
];

function validateImage(buffer, contentType) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new AppError(
      400,
      'IMAGE_REQUIRED',
      'Envie o conteúdo de uma imagem.',
    );
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new AppError(
      413,
      'IMAGE_TOO_LARGE',
      'A imagem deve ter no máximo 6 MB.',
    );
  }

  const image = IMAGE_SIGNATURES.find(({ matches }) => matches(buffer));

  if (
    !image ||
    (contentType !== 'application/octet-stream' &&
      contentType !== image.contentType)
  ) {
    throw new AppError(
      400,
      'INVALID_IMAGE',
      'Envie uma imagem JPEG, PNG, GIF ou WebP válida.',
    );
  }

  return image;
}

function validatePublicId(publicId) {
  if (
    typeof publicId !== 'string' ||
    !/^associacao\/(?:products|news)\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      publicId,
    )
  ) {
    throw new AppError(
      400,
      'INVALID_IMAGE_ID',
      'O identificador da imagem é inválido.',
    );
  }

  return publicId;
}

export class MediaService {
  constructor(cloudinaryClient = cloudinary, logger = console) {
    this.cloudinary = cloudinaryClient;
    this.logger = logger;
  }

  assertConfigured() {
    let config;

    try {
      config = this.cloudinary.config();
    } catch {
      config = null;
    }

    if (!config?.cloud_name || !config?.api_key || !config?.api_secret) {
      throw new AppError(
        503,
        'IMAGE_STORAGE_UNAVAILABLE',
        'O armazenamento de imagens não está configurado.',
      );
    }
  }

  async uploadImage({ buffer, contentType, folder }) {
    const image = validateImage(buffer, contentType);

    if (!ALLOWED_FOLDERS.has(folder)) {
      throw new AppError(
        400,
        'INVALID_IMAGE_FOLDER',
        'A pasta deve ser products ou news.',
      );
    }

    this.assertConfigured();

    const publicId = `associacao/${folder}/${randomUUID()}`;
    let result;

    try {
      result = await new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            overwrite: false,
            resource_type: 'image',
          },
          (error, uploadResult) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(uploadResult);
          },
        );

        uploadStream.on('error', reject);
        uploadStream.end(buffer);
      });
    } catch (error) {
      this.logger.error(
        'Cloudinary image upload failed:',
        error?.error?.message ?? error?.message ?? 'Unknown error',
      );
      throw new AppError(
        502,
        'IMAGE_UPLOAD_FAILED',
        'Não foi possível enviar a imagem ao armazenamento.',
      );
    }

    if (!result?.secure_url || !result?.public_id || !result?.asset_id) {
      throw new AppError(
        502,
        'IMAGE_UPLOAD_FAILED',
        'O armazenamento não retornou os dados da imagem.',
      );
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      assetId: result.asset_id,
      format: result.format ?? image.format,
      bytes: result.bytes,
    };
  }

  async deleteImage(publicId) {
    const validatedPublicId = validatePublicId(publicId);
    this.assertConfigured();

    let result;

    try {
      result = await this.cloudinary.uploader.destroy(validatedPublicId, {
        resource_type: 'image',
      });
    } catch (error) {
      this.logger.error(
        'Cloudinary image deletion failed:',
        error?.error?.message ?? error?.message ?? 'Unknown error',
      );
      throw new AppError(
        502,
        'IMAGE_DELETE_FAILED',
        'Não foi possível remover a imagem do armazenamento.',
      );
    }

    if (result?.result === 'not found') {
      throw new AppError(
        404,
        'IMAGE_NOT_FOUND',
        'A imagem não foi encontrada no armazenamento.',
      );
    }

    if (result?.result !== 'ok') {
      throw new AppError(
        502,
        'IMAGE_DELETE_FAILED',
        'O armazenamento não confirmou a remoção da imagem.',
      );
    }
  }
}
