import { rateLimit } from 'express-rate-limit';

export const productListRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => {
    return res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message:
        'Muitas requisições. Tente novamente mais tarde.',
    });
  },
});
