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

  // Erros do body-parser (corpo grande demais / JSON malformado).
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'PAYLOAD_TOO_LARGE',
      message:
        'Os dados enviados são grandes demais. Use imagens menores.',
    });
  }

  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'INVALID_JSON',
      message: 'O corpo da requisição não é um JSON válido.',
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor.',
  });
}
