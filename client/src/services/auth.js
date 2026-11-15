import { api } from './api.js';
import {
  getStoredAccessToken,
  removeStoredAccessToken,
  storeAccessToken,
} from './token.js';

export function setAccessToken(accessToken) {
  if (!accessToken) {
    throw new Error('Token de acesso inválido.');
  }

  storeAccessToken(accessToken);
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function getAccessToken() {
  return getStoredAccessToken();
}

export function clearAccessToken() {
  removeStoredAccessToken();
  delete api.defaults.headers.common.Authorization;
}

export async function restoreSession() {
  const storedToken = getAccessToken();

  if (storedToken) {
    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    return storedToken;
  }

  const { data } = await api.post('/auth/refresh');

  if (!data?.accessToken) {
    throw new Error('A sessão não pôde ser restaurada.');
  }

  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAccessToken();
  }
}
