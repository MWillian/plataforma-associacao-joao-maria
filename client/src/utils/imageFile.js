// Lê uma imagem escolhida pelo usuário como data URL (base64), reduzindo
// fotos grandes (máx. 1280 px) para o envio ao backend ficar leve.
export function readImageAsDataUrl(file, maxSize = 1280, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () =>
      reject(new Error('Não foi possível ler a imagem.'));

    reader.onload = () => {
      const original = reader.result;

      // GIF fica como está (reduzir perderia a animação).
      if (file.type === 'image/gif') {
        resolve(original);
        return;
      }

      const image = new Image();

      image.onerror = () => resolve(original);

      image.onload = () => {
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        );

        if (scale === 1 && file.size <= 500 * 1024) {
          resolve(original);
          return;
        }

        const canvas = document.createElement('canvas');

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas
          .getContext('2d')
          .drawImage(image, 0, 0, canvas.width, canvas.height);

        // PNG mantém a transparência; as demais viram JPEG.
        resolve(
          file.type === 'image/png'
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', quality)
        );
      };

      image.src = original;
    };

    reader.readAsDataURL(file);
  });
}
