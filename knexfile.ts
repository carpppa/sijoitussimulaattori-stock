import config from './src/config';
import 'knex';

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
