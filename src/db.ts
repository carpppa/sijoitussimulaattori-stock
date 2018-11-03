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

client.raw('SELECT 1').then((res) => logger.debug('testi', res));

const testDBConnection = async () =>
  pool
    .query('SELECT 1')
    .then((res) => logger.info('MORO', res))
    .catch((err) => logger.debug('database err', err));

testDBConnection().then(() =>
  pool.end(() => logger.info('database pool closed'))
);
