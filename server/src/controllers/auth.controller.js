import { env } from '../config/env.js';
import {
  forgotPassword,
  login,
  logout,
  refreshSession,
  resetPassword,
} from '../services/auth.service.js';

const REFRESH_COOKIE = 'refresh_token';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((cookies, item) => {
      const separator = item.indexOf('=');

      if (separator === -1) {
        return cookies;
      }

      const name = item.slice(0, separator).trim();
      const value = item.slice(separator + 1).trim();

      cookies[name] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function getRefreshToken(req) {
  return parseCookies(req.headers.cookie)[REFRESH_COOKIE];
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: '/api/auth',
  };
}

function setRefreshCookie(res, token, sessionExpiresAt) {
  res.cookie(REFRESH_COOKIE, token, {
    ...refreshCookieOptions(),
    expires: new Date(sessionExpiresAt),
  });
}

export async function loginController(req, res, next) {
  try {
    const result = await login(req.body ?? {});

    setRefreshCookie(
      res,
      result.refreshToken,
      result.sessionExpiresAt,
    );

    return res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    return next(error);
  }
}

export async function refreshController(req, res, next) {
  try {
    const result = await refreshSession(getRefreshToken(req));

    setRefreshCookie(
      res,
      result.refreshToken,
      result.sessionExpiresAt,
    );

    return res.status(200).json({
      accessToken: result.accessToken,
    });
  } catch (error) {
    return next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    await logout(getRefreshToken(req));

    res.clearCookie(
      REFRESH_COOKIE,
      refreshCookieOptions(),
    );

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function forgotPasswordController(req, res, next) {
  try {
    await forgotPassword(req.body?.email);

    return res.status(200).json({
      message:
        'Se o e-mail estiver cadastrado, enviaremos as instruções para recuperação da senha.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    await resetPassword(req.body ?? {});

    return res.status(200).json({
      message: 'Senha redefinida com sucesso.',
    });
  } catch (error) {
    return next(error);
  }
}
