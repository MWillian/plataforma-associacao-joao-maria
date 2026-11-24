import { api } from './api.js';
import { readImageAsDataUrl } from '../utils/imageFile.js';

function dataUrlToBlob(dataUrl) {
  const match = /^data:(image\/(?:png|jpe?g|gif|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(
    dataUrl
  );

  if (!match) {
    throw new Error('O arquivo selecionado não contém uma imagem válida.');
  }

  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: match[1] });
}

export async function uploadImageToCloudinary(image, folder) {
  const source = image?.file
    ? await readImageAsDataUrl(image.file)
    : typeof image === 'string'
      ? image
      : image?.url;

  if (typeof source !== 'string' || source.startsWith('blob:')) {
    return null;
  }

  if (/^https?:\/\//i.test(source)) {
    return { url: source };
  }

  const blob = dataUrlToBlob(source);
  const { data } = await api.post(`/media/images/${folder}`, blob, {
    headers: { 'Content-Type': blob.type },
  });

  return data;
}
