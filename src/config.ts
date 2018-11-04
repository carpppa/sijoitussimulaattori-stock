import { ensureNecessaryEnvs, randomInt } from './util/general';

process.on('uncaughtException', (err) => {
  console.log('\x1b[31m', 'error: uncaught exception:', err);
});

// List here the required environment variables:
ensureNecessaryEnvs(['NODE_ENV', 'DATABASE_URL', 'ALPHA_VANTAGE_API_KEY']);

const config = {
  app: {
    NODE_ENV: process.env.NODE_ENV || '',
    LOGGER_LEVEL: process.env.LOG_LEVEL || 'info',
    ALPHA_VANTAGE_URL:
      (process.env.NODE_ENV === 'production' &&
        process.env.ALPHA_VANTAGE_URL) ||
      'https://www.dev-alphavantage.co',
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY || '',
  },
  db: {
    CONNECTION_STRING:
      process.env.NODE_ENV === 'test'
        ? `${process.env.DATABASE_URL}_test${randomInt()}`
        : process.env.DATABASE_URL || '',
  },
};

export default config;
