import * as pg from 'pg';

import config from './src/config';

pg.defaults.ssl =
  config.app.NODE_ENV === 'production' || config.app.CI === true;

module.exports = {
  development: {
    client: 'pg',
    connection: config.db.CONNECTION_STRING,
    pool: {
      min: 0,
      max: 7,
    },
    migrations: {
      directory: 'db/migrations',
      tableName: 'migrations',
    },
  },
  production: {
    client: 'pg',
    connection: config.db.CONNECTION_STRING,
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      directory: 'db/migrations',
      tableName: 'migrations',
    },
  },
  test: {
    client: 'pg',
    connection: config.db.CONNECTION_STRING,
    pool: {
      min: 0,
      max: 7,
    },
    migrations: {
      directory: 'db/migrations',
      tableName: 'migrations',
    },
  },
};
