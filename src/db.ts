import * as Knex from 'knex';
import * as pg from 'pg';

import * as dbConfig from '../knexfile';
import config from './config';
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

// Parse psql big integers as numbers (stored as text):
pg.types.setTypeParser(20, 'text', parseInt);

const client = Knex(
  (dbConfig as { [key: string]: Knex.Config })[config.app.NODE_ENV]
);

client
  .first()
  .from(DatabaseTables.Symbols)
  .then((res) => logger.debug('db test query', res))
  .catch((err) => logger.error('db test query failed', err));

export { DatabaseTables, DailyQuotesTable, SymbolsTable, client };
