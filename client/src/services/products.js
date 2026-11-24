import { api } from './api.js';
import { productFromApi } from './productMapper.js';
import { uploadImageToCloudinary } from './media.js';

const CATEGORY_TO_API = {
  Artesanato: 'artesanato',
  'Agricultura Familiar': 'agricultura',
};

async function imagesToUrls(images = []) {
  const urls = [];

  for (const image of images) {
    const uploadedImage = await uploadImageToCloudinary(image, 'products');

    if (uploadedImage?.url) {
      urls.push(uploadedImage.url);
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

export async function listProductHighlights(category) {
  const { data } = await api.get('/products/highlights', {
    params: { category },
  });
  return data.items.map((item) => productFromApi(item));
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
  await api.delete(`/products/${id}`);
}
