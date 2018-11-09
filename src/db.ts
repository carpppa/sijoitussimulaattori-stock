import * as Knex from 'knex';

import db_connection_config = require('../knexfile');
import { logger } from './util/logger';

logger.debug('database connection', db_connection_config);

const enum DatabaseTables {
  DailyQuotes = 'daily_quotes',
}

const client = Knex(db_connection_config);

client
  .first()
  .from(DatabaseTables.DailyQuotes)
  .then((res) => logger.debug('db test query', res))
  .catch((err) => logger.error('db test query failed', err));

export { DatabaseTables, client };
