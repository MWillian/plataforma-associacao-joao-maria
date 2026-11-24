function getDataUrlSize(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;

  return Math.floor((base64.length * 3) / 4) - padding;
}

// Reduz imagens para no máximo 1280 px e usa WebP quando o resultado for menor.
export function readImageAsDataUrl(file, maxSize = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () =>
      reject(new Error('Não foi possível ler a imagem.'));

    reader.onload = () => {
      const original = reader.result;

      if (typeof original !== 'string') {
        reject(new Error('Não foi possível ler a imagem.'));
        return;
      }

      // GIF fica como está para preservar a animação.
      if (file.type === 'image/gif') {
        resolve(original);
        return;
      }

      const image = new Image();

      image.onerror = () =>
        reject(new Error('Não foi possível processar a imagem.'));

      image.onload = () => {
        try {
          const scale = Math.min(
            1,
            maxSize / Math.max(image.width, image.height)
          );
          const canvas = document.createElement('canvas');

          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext('2d');

          if (!context) {
            reject(new Error('Não foi possível processar a imagem.'));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          let optimized = canvas.toDataURL('image/webp', quality);

          if (!optimized.startsWith('data:image/webp;')) {
            optimized =
              file.type === 'image/png' || file.type === 'image/webp'
                ? canvas.toDataURL('image/png')
                : canvas.toDataURL('image/jpeg', quality);
          }

          resolve(
            getDataUrlSize(optimized) < file.size
              ? optimized
              : original
          );
        } catch {
          reject(new Error('Não foi possível processar a imagem.'));
        }
      };

      image.src = original;
    };

    reader.readAsDataURL(file);
  });
}
