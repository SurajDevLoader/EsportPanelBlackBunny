import 'dotenv/config';

function parsePort(value) {
  const port = Number(value || 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port');
  }
  return port;
}

function requiredOrigin(value) {
  const origin = value || 'http://localhost:5173';
  try {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    return url.origin;
  } catch {
    throw new Error('CORS_ORIGIN must be a valid HTTP(S) origin');
  }
}

export const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parsePort(process.env.PORT),
  corsOrigin: requiredOrigin(process.env.CORS_ORIGIN),
  sessionTtlSeconds: Number(process.env.SESSION_TTL_SECONDS || 1800),
});

if (!Number.isInteger(config.sessionTtlSeconds) || config.sessionTtlSeconds < 300 || config.sessionTtlSeconds > 86400) {
  throw new Error('SESSION_TTL_SECONDS must be between 300 and 86400');
}
