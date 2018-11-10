import * as Knex from 'knex';

import db_connection_config = require('../knexfile');
import { logger } from './util/logger';

logger.debug('database connection', db_connection_config);

const enum DatabaseTables {
  DailyQuotes = 'daily_quotes',
}

const enum DailyQuotesTable {
  Symbol = 'symbol',
  Date = 'date',
  Open = 'open',
  High = 'high',
  Low = 'low',
  Close = 'close',
  Volume = 'colume',
}

const client = Knex(db_connection_config);

client
  .first()
  .from(DatabaseTables.DailyQuotes)
  .then((res) => logger.debug('db test query', res))
  .catch((err) => logger.error('db test query failed', err));

export { DatabaseTables, DailyQuotesTable, client };
