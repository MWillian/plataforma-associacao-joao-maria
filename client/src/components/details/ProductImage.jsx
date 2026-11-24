export function ProductImage({ src, alt, children }) {
  const imageSource = typeof src === 'string' ? src : src?.url;
  const isImage =
    typeof imageSource === 'string' &&
    (imageSource.startsWith('data:image/') || imageSource.startsWith('http'));

  if (isImage) {
    return (
      <img
        src={imageSource}
        alt={alt}
        className="h-full w-full object-cover"
      />
    );
  }

  return children;
}
