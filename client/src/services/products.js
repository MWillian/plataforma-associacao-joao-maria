import { api } from './api.js';
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
  await api.delete(`/products/${id}`);
}
