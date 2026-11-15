import axios from 'axios';
import { storeAccessToken } from './token.js';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isRefreshRequest = request?.url?.endsWith('/auth/refresh');

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      const { data } = await api.post('/auth/refresh');

      if (!data?.accessToken) {
        return Promise.reject(error);
      }

      storeAccessToken(data.accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      request.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);