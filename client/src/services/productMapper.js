const CATEGORY_TO_API = {
  'Agricultura Familiar': 'AGRICULTURE',
  Artesanato: 'CRAFTS',
};

const CATEGORY_FROM_API = {
  AGRICULTURE: 'Agricultura Familiar',
  agricultura: 'Agricultura Familiar',
  CRAFTS: 'Artesanato',
  artesanato: 'Artesanato',
};

function getImageUrls(product) {
  return (product.images || [])
    .map((image) => (
      typeof image === 'string' ? image : image?.url
    ))
    .filter((url) =>
      typeof url === 'string' &&
      url.trim() !== '' &&
      !url.startsWith('blob:')
    )
    .filter(Boolean);
}

export function productToApi(product) {
  const imageUrls = getImageUrls(product);

  return {
    title: product.name || product.title,
    description: product.description?.trim() || null,
    category:
      CATEGORY_TO_API[product.category] ||
      product.category?.trim().toLowerCase(),
    imageUrl: imageUrls[0] || product.imageUrl || null,
    images: imageUrls,
    price:
      product.price === '' ||
      product.price === null ||
      product.price === undefined
        ? null
        : Number(product.price),
    active: product.available ?? product.active ?? true,
  };
}

export function productFromApi(product, fallback = {}) {
  const imageUrls = product.images?.length
    ? product.images
        .map((image) => (
          typeof image === 'string' ? image : image?.url
        ))
        .filter(Boolean)
    : [product.imageUrl || fallback.imageUrl].filter(Boolean);

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
    price: product.price ?? fallback.price,
    images: imageUrls.length
      ? imageUrls.map((url) => ({ url }))
      : fallback.images || [],
    available: product.active ?? fallback.available ?? true,
    createdAt: product.createdAt ?? fallback.createdAt,
  };
}

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// Formato usado pelas páginas públicas (catálogo e detalhe).
export function productToPublic(product) {
  const images = (product.images || [])
    .map((image) => (typeof image === 'string' ? image : image?.url))
    .filter(Boolean);

  return {
    id: product.id,
    tag: 'Produto',
    title: product.name,
    description: product.description || '',
    price:
      product.price === null || product.price === undefined
        ? 'Sob consulta'
        : BRL.format(Number(product.price)),
    unit: '/ unidade',
    badge:
      product.category === 'Artesanato'
        ? 'PRODUTO COOPERATIVO'
        : 'AGRICULTURA FAMILIAR',
    category: 'Produtos',
    images,
  };
}
