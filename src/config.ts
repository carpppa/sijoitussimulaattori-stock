import { ensureNecessaryEnvs } from './util/general';

process.on('uncaughtException', (err) => {
  console.log('\x1b[31m', 'error: uncaught exception:', err);
});

// List here the required environment variables:
ensureNecessaryEnvs(['NODE_ENV', 'DATABASE_URL', 'ALPHA_VANTAGE_API_KEY']);

const config = {
  app: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOGGER_LEVEL: process.env.LOG_LEVEL || 'info',
    ALPHA_VANTAGE_URL:
      (process.env.NODE_ENV !== 'development' &&
        process.env.ALPHA_VANTAGE_URL) ||
      'http://127.0.0.1:8888',
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
    CI: process.env.TRAVIS || false,
  },
  db: {
    CONNECTION_STRING: process.env.DATABASE_URL || '',
    TIME_ZONE: process.env.TZ || 'GMT',
  },
};

export default config;
