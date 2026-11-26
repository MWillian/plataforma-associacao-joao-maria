import { rateLimit } from 'express-rate-limit';

function createRateLimit({ limit, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    skip: () => process.env.NODE_ENV !== 'production',
    skipSuccessfulRequests,
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
}

export const productListRateLimit = createRateLimit({
  limit: 100,
});

export const newsListRateLimit = createRateLimit({
  limit: 100,
});

export const loginRateLimit = createRateLimit({
  limit: 10,
  skipSuccessfulRequests: true,
});
