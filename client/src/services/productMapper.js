const CATEGORY_TO_API = {
  'Agricultura Familiar': 'agricultura',
  Artesanato: 'artesanato',
};

const CATEGORY_FROM_API = {
  agricultura: 'Agricultura Familiar',
  artesanato: 'Artesanato',
};

function getImageUrl(product) {
  if (product.imageUrl) {
    return product.imageUrl;
  }

  const firstImage = product.images?.[0];
  return typeof firstImage === 'string'
    ? firstImage
    : firstImage?.url || null;
}

export function productToApi(product) {
  return {
    title: product.name || product.title,
    description: product.description?.trim() || null,
    category:
      CATEGORY_TO_API[product.category] ||
      product.category?.trim().toLowerCase(),
    imageUrl: getImageUrl(product),
    active: product.available ?? product.active ?? true,
  };
}

export function productFromApi(product, fallback = {}) {
  const imageUrl = product.imageUrl || fallback.imageUrl || null;

  return {
    ...fallback,
    id: product.id ?? fallback.id,
    name: product.title ?? fallback.name ?? '',
    description: product.description ?? fallback.description ?? '',
    category:
      CATEGORY_FROM_API[product.category] ||
      fallback.category ||
      product.category ||
      'Outros',
    price: fallback.price,
    images: imageUrl
      ? [{ url: imageUrl }]
      : fallback.images || [],
    available: product.active ?? fallback.available ?? true,
  };
}
