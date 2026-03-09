import { registerAs } from '@nestjs/config';

import { validateEnv } from './env.validation';

const parseDurationToMs = (value: string): number => {
  const normalized = value.trim().toLowerCase();

  if (/^\d+$/.test(normalized)) {
    return Number(normalized) * 1000;
  }

  const match = normalized.match(/^(\d+)(s|m|h|d)$/);
  if (!match) {
    throw new Error('JWT_EXPIRES_IN must be a number (seconds) or value like 15m/1h/7d.');
  }

  const amount = Number(match[1]);
  const unit = match[2];

  const unitToMs: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return amount * unitToMs[unit];
};

const testDefaults: Record<string, string> = {
  PORT: '3000',
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_USERNAME: 'root',
  DB_PASSWORD: 'root',
  DB_NAME: 'liyana_test',
  JWT_SECRET: 'a'.repeat(64),
  JWT_EXPIRES_IN: '1h',
  UPLOAD_PATH: '/tmp/liyana-uploads-test',
  ALLOWED_ORIGINS: 'http://localhost:3000',
  THROTTLE_TTL: '60',
  THROTTLE_LIMIT: '100',
  COOKIE_SECRET: 'b'.repeat(64),
  TRUST_PROXY_DEPTH: '0',
};

const rawEnv =
  process.env.NODE_ENV === 'test'
    ? { ...testDefaults, ...process.env }
    : process.env;

const env = validateEnv(rawEnv);

export default registerAs('app', () => ({
  nodeEnv: env.NODE_ENV ?? 'development',
  port: env.PORT,
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    expiresInMs: parseDurationToMs(env.JWT_EXPIRES_IN),
    cookie: {
      httpOnly: true,
      secure: (env.NODE_ENV ?? 'development') === 'production',
      sameSite: 'strict' as const,
      maxAge: parseDurationToMs(env.JWT_EXPIRES_IN),
    },
  },
  upload: {
    path: env.UPLOAD_PATH,
    maxFileSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    blockedExtensions: ['.exe', '.sh', '.php', '.bat', '.cmd', '.com', '.msi', '.js'],
  },
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  },
  throttle: {
    /** TTL in seconds */
    ttlSeconds: env.THROTTLE_TTL,
    limit: env.THROTTLE_LIMIT,
  },
  trustProxyDepth: env.TRUST_PROXY_DEPTH,
  cookieSecret: env.COOKIE_SECRET,
}));
