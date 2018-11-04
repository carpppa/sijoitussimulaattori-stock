import * as Knex from 'knex';

import db_connection_config = require('../knexfile');
import logger from './util/logger';
import { Pool, PoolClient } from 'pg';
import config from './config';

logger.debug('database connection', db_connection_config);

const client = Knex(db_connection_config);

export default client;

const pool = new Pool({
  connectionString: config.db.CONNECTION_STRING,
});

client
  .raw('SELECT * from daily_quotes')
  .then((res) => logger.debug('db test query', res))
  .catch((err) => logger.error('db test query failed', err));
