import config from './src/config';
import * as pg from 'pg';
import 'knex';

pg.defaults.ssl = config.app.NODE_ENV === 'production';

export = {
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
};
