// Mostra a imagem do produto quando houver; caso contrário, o conteúdo
// de reserva (children).
export function ProductImage({ src, alt, children }) {
  const isImage =
    typeof src === 'string' &&
    (src.startsWith('data:image/') || src.startsWith('http'));

  if (isImage) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    );
  }

  return children;
}
