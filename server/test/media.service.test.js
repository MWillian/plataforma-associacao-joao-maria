import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { describe, it } from 'node:test';
import { MediaService } from '../src/services/media.service.js';

const VALID_PUBLIC_ID =
  'associacao/products/123e4567-e89b-42d3-a456-426614174000';
const PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function createCloudinary(overrides = {}) {
  const uploaded = {
    public_id: 'associacao/products/123e4567-e89b-42d3-a456-426614174000',
    asset_id: 'asset-id',
    secure_url: 'https://res.cloudinary.com/demo/image/upload/example.png',
    format: 'png',
    bytes: PNG_BUFFER.length,
  };

  return {
    config: () => ({
      cloud_name: 'demo',
      api_key: '123',
      api_secret: 'secret',
    }),
    uploader: {
      upload_stream: (options, callback) => {
        overrides.onUploadOptions?.(options);

        return new Writable({
          write(chunk, _encoding, done) {
            overrides.onChunk?.(chunk);
            done();
          },
          final(done) {
            if (overrides.uploadError) {
              callback(overrides.uploadError);
            } else {
              callback(null, overrides.uploadResult ?? uploaded);
            }

            done();
          },
        });
      },
      destroy: async (publicId, options) => {
        overrides.onDestroy?.(publicId, options);
        return overrides.deleteResult ?? { result: 'ok' };
      },
    },
  };
}

describe('MediaService', () => {
  it('envia imagem sem transformações e retorna referências do Cloudinary', async () => {
    let options;
    const service = new MediaService(
      createCloudinary({
        onUploadOptions: (value) => {
          options = value;
        },
      }),
    );

    const result = await service.uploadImage({
      buffer: PNG_BUFFER,
      contentType: 'image/png',
      folder: 'products',
    });

    assert.match(options.public_id, /^associacao\/products\//);
    assert.equal(options.overwrite, false);
    assert.equal(options.resource_type, 'image');
    assert.equal('transformation' in options, false);
    assert.deepEqual(result, {
      url: 'https://res.cloudinary.com/demo/image/upload/example.png',
      publicId: 'associacao/products/123e4567-e89b-42d3-a456-426614174000',
      assetId: 'asset-id',
      format: 'png',
      bytes: PNG_BUFFER.length,
    });
  });

  it('rejeita imagens inválidas e pastas não autorizadas sem chamar o provedor', async () => {
    let uploadCalled = false;
    const service = new MediaService(
      createCloudinary({
        onUploadOptions: () => {
          uploadCalled = true;
        },
      }),
    );

    await assert.rejects(
      () =>
        service.uploadImage({
          buffer: Buffer.from('not an image'),
          contentType: 'image/png',
          folder: 'products',
        }),
      { statusCode: 400, code: 'INVALID_IMAGE' },
    );

    await assert.rejects(
      () =>
        service.uploadImage({
          buffer: PNG_BUFFER,
          contentType: 'image/png',
          folder: 'other',
        }),
      { statusCode: 400, code: 'INVALID_IMAGE_FOLDER' },
    );

    assert.equal(uploadCalled, false);
  });

  it('retorna erro explícito quando o Cloudinary não está configurado', async () => {
    const service = new MediaService({
      config: () => ({}),
      uploader: {
        upload_stream() {
          assert.fail('upload should not be called');
        },
      },
    });

    await assert.rejects(
      () =>
        service.uploadImage({
          buffer: PNG_BUFFER,
          contentType: 'image/png',
          folder: 'products',
        }),
      { statusCode: 503, code: 'IMAGE_STORAGE_UNAVAILABLE' },
    );
  });

  it('remove apenas publicIds das pastas gerenciadas', async () => {
    let deletedPublicId;
    const service = new MediaService(
      createCloudinary({
        onDestroy: (publicId) => {
          deletedPublicId = publicId;
        },
      }),
    );

    await service.deleteImage(VALID_PUBLIC_ID);
    assert.equal(deletedPublicId, VALID_PUBLIC_ID);

    await assert.rejects(
      () => service.deleteImage('other/123e4567-e89b-42d3-a456-426614174000'),
      { statusCode: 400, code: 'INVALID_IMAGE_ID' },
    );
  });

  it('trata uma imagem já removida como sucesso idempotente', async () => {
    const service = new MediaService(
      createCloudinary({
        deleteResult: { result: 'not found' },
      }),
    );

    await service.deleteImage(VALID_PUBLIC_ID);
  });
});
