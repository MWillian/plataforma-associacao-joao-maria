import { api } from './api.js';
<<<<<<< HEAD
import { productFromApi, productToApi } from './productMapper.js';

export async function listProducts(page = 1) {
  const { data } = await api.get('/products', { params: { page } });
  return {
    ...data,
    items: (data.items ?? []).map((item) => productFromApi(item)),
  };
}

export async function listProductHighlights(category) {
  const { data } = await api.get('/products/highlights', {
    params: { category },
  });
  return (data.items ?? []).map((item) => productFromApi(item));
}

export async function createProduct(product) {
  const { data } = await api.post('/products', productToApi(product));
  return productFromApi(data);
}

export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, productToApi(product));
  return productFromApi(data);
}

export async function removeProduct(id) {
=======
import { productFromApi } from './productMapper.js';
import { readImageAsDataUrl } from '../utils/imageFile.js';

const CATEGORY_TO_API = {
  Artesanato: 'artesanato',
  'Agricultura Familiar': 'agricultura',
};

// Arquivos novos viram data URL; imagens já salvas (data URL ou link) são
// reaproveitadas; links temporários (blob:) são descartados.
async function imagesToUrls(images = []) {
  const urls = [];

  for (const image of images) {
    if (image?.file) {
      urls.push(await readImageAsDataUrl(image.file));
      continue;
    }

    const url = typeof image === 'string' ? image : image?.url;

    if (url && !url.startsWith('blob:')) {
      urls.push(url);
    }
  }

  return urls;
}

async function toPayload(form) {
  return {
    title: form.name,
    description: form.description,
    category: CATEGORY_TO_API[form.category] ?? form.category,
    price: Number(form.price),
    images: await imagesToUrls(form.images),
  };
}

// Site público: só produtos disponíveis.
export async function listPublicProducts() {
  const { data } = await api.get('/products', { params: { limit: 100 } });
  return data.items.map((item) => productFromApi(item));
}

// Painel admin: todos, inclusive os indisponíveis.
export async function listAdminProducts() {
  const { data } = await api.get('/products/admin');
  return data.map((item) => productFromApi(item));
}

export async function createProduct(form) {
  const { data } = await api.post('/products', await toPayload(form));
  return productFromApi(data);
}

export async function updateProduct(id, form) {
  const { data } = await api.put(`/products/${id}`, await toPayload(form));
  return productFromApi(data);
}

// Marca como disponível/indisponível (o PUT não altera a disponibilidade).
export async function setProductAvailability(id, available) {
  const { data } = await api.patch(
    `/products/${id}/${available ? 'activate' : 'inactivate'}`
  );
  return productFromApi(data);
}

export async function deleteProduct(id) {
>>>>>>> origin/main
  await api.delete(`/products/${id}`);
}
