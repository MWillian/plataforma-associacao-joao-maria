export const ACCESS_TOKEN_KEY = 'joao-maria.access-token';

export function storeAccessToken(accessToken) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function getStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeStoredAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}
