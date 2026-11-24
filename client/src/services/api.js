import axios from 'axios';
import { storeAccessToken } from './token.js';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Evento disparado quando a sessão não pode ser renovada; o App escuta e
// leva o usuário de volta ao login.
export const SESSION_EXPIRED_EVENT = 'joao-maria:session-expired';

// Respostas 401 destas rotas são o resultado final da própria autenticação
// (ex.: senha incorreta no login) e não devem disparar renovação de sessão.
const AUTH_ROUTES_WITHOUT_REFRESH = ['/auth/login', '/auth/refresh', '/auth/logout'];

function isAuthRoute(url = '') {
  return AUTH_ROUTES_WITHOUT_REFRESH.some((route) => url.endsWith(route));
}

// O backend troca o refresh token a cada uso. Se várias requisições recebem
// 401 ao mesmo tempo, todas devem esperar UMA única renovação; renovações
// em paralelo usariam o mesmo token e só a primeira seria aceita.
let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then(({ data }) => {
        if (!data?.accessToken) {
          throw new Error('A sessão não pôde ser renovada.');
        }

        storeAccessToken(data.accessToken);
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isAuthRoute(request.url)
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    let accessToken;

    try {
      accessToken = await refreshAccessToken();
    } catch (refreshError) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      return Promise.reject(refreshError);
    }

    request.headers = request.headers ?? {};
    request.headers.Authorization = `Bearer ${accessToken}`;
    return api(request);
  }
);
