function buildCorsOptions(env = process.env) {
  const productionOrigins = [
    'https://nirali2601.github.io',
    'https://www.nirali2601.github.io'
  ];

  const configuredOrigin = env.CLIENT_URL || env.FRONTEND_URL || '';
  const allowedOrigins = new Set([
    ...productionOrigins,
    ...(configuredOrigin ? [configuredOrigin] : []),
    'http://localhost:4200',
    'http://127.0.0.1:4200'
  ]);

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      if (env.NODE_ENV === 'production' && /https:\/\/[^/]+\.github\.io/.test(origin)) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
}

module.exports = { buildCorsOptions };
