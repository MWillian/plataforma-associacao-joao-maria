import { AppError } from '../utils/app-error.js';

export function notFoundHandler(req, _res, next) {
  return next(
    new AppError(
      404,
      'NOT_FOUND',
      `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    ),
  );
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    const body = {
      error: error.code,
      message: error.message,
    };

    if (error.fields) {
      body.fields = error.fields;
    }

    return res
      .status(error.statusCode)
      .json(body);
  }

  console.error(error);

  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor.',
  });
}
