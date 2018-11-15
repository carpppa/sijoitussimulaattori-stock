import * as Knex from 'knex';

import db_connection_config = require('../knexfile');
import { logger } from './util/logger';

const enum DatabaseTables {
  DailyQuotes = 'daily_quotes',
  Symbols = 'symbols',
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

const enum SymbolsTable {
  Symbol = 'symbol',
  Name = 'name',
  Type = 'type',
  Region = 'region',
  MarketOpen = 'marketOpen',
  MarketClose = 'marketClose',
  TimeZone = 'timeZone',
  Currency = 'currency',
}

const client = Knex(db_connection_config);

client
  .first()
  .from(DatabaseTables.Symbols)
  .then((res) => logger.debug('db test query', res))
  .catch((err) => logger.error('db test query failed', err));

export { DatabaseTables, DailyQuotesTable, SymbolsTable, client };
