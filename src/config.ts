import { ensureNecessaryEnvs, randomInt } from './util/general';

// List here the required environment variables:
ensureNecessaryEnvs(['NODE_ENV', 'DATABASE_URL']);

const config = {
  app: {
    NODE_ENV: process.env.NODE_ENV || '',
    LOGGER_LEVEL: process.env.LOG_LEVEL || 'info',
  },
  db: {
    CONNECTION_STRING:
      process.env.NODE_ENV === 'test'
        ? `${process.env.DATABASE_URL}_test${randomInt()}`
        : process.env.DATABASE_URL || '',
  },
};

export default config;
