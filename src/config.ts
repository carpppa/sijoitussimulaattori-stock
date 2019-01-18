import { ensureNecessaryEnvs } from './util/general';

process.on('uncaughtException', (err) => {
  // tslint:disable-next-line:no-console
  console.log('\x1b[31m', 'error: uncaught exception:', err);
});

// List here the required environment variables:
ensureNecessaryEnvs([
  'NODE_ENV',
  'DATABASE_URL',
  'REDIS_URL',
  'ALPHA_VANTAGE_URL',
  'ALPHA_VANTAGE_API_KEY',
]);

const config = {
  app: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOGGER_LEVEL: process.env.LOG_LEVEL || 'info',
    ALPHA_VANTAGE_URL: process.env.ALPHA_VANTAGE_URL || '',
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
    CI: process.env.TRAVIS || false,
    TIME_ZONE: process.env.TZ || 'GMT',
  },
  db: {
    CONNECTION_STRING: process.env.DATABASE_URL || '',
  },
  redis: {
    REDIS_URL: process.env.REDIS_URL || '',
  },
};

process.env.TZ = config.app.TIME_ZONE;

export default config;
