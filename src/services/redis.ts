import { client } from '../redis';
import { getOrThrow } from '../util/general';
import { logger } from '../util/logger';
import { getAvIntraDaySeries } from './alpha-vantage';
import { DailyQuote, SUPPORTED_SYMBOLS, SymbolName } from './stock-data-types';

/**
 * Data structure for the redis cache is as follows:
 * SYMBOL_SET -> SET {
 *   <symbolName> -> SET {
 *     <entryKey> -> HASH {
 *        [data of one DailyQuote]
 *     }
 *   }
 * }
 */
const SYMBOL_SET = 'symbols';

/**
 * Inserts the given list of quotes into the cache for the given symbol.
 * Data from previous day(s), if any, will be discarded.
 * @param symbol The symbol name for which to insert the series
 * @param intraDaySeries The intraday series to insert
 */
const insertNewIntraDaySeries = async (
  symbol: SymbolName,
  intraDaySeries: DailyQuote[]
): Promise<void> =>
  new Promise<void>(async (resolve, reject) => {
    try {
      // Get yesterday's (and older) entries keys:
      const prevEntries = (await getEntryKeys(symbol)).filter(
        (key) =>
          new Date(
            new Date(key.slice(key.indexOf(':') + 1)).setUTCHours(0, 0, 0, 0)
          ) < new Date(new Date(intraDaySeries[0].date).setUTCHours(0, 0, 0, 0))
      );

      // Insert new entries
      await Promise.all(
        intraDaySeries.map((quote) => insertNewQuote(symbol, quote))
      );

      // Remove old entries:
      await removeQuotes(symbol, prevEntries);

      return resolve();
    } catch (error) {
      logger.error(`inserting quote series for symbol '${symbol}'`, error);
      return reject(error);
    }
  });

/**
 * Get the keys of the quote entries for the given symbol.
 * @param symbol The symbol of which entries to retrieve
 */
const getEntryKeys = async (symbol: SymbolName): Promise<string[]> =>
  new Promise<string[]>((resolve, reject) =>
    client.smembers(symbol, (err, keys) => {
      if (!err) {
        return resolve(keys);
      }
      logger.error(
        `fetching time series keys from cache for symbol '${symbol}'`,
        err
      );
      return reject(err);
    })
  );

/**
 * Removes the given list of entries from the cache and their
 * keys from the set of keys of the symbol.
 * @param symbol Name of the symbol to manage
 * @param entryKeys Entry keys of the entries to remove
 */
const removeQuotes = async (
  symbol: SymbolName,
  entryKeys: string[]
): Promise<void> =>
  new Promise<void>((resolve, reject) =>
    entryKeys.length > 0
      ? client.del(entryKeys, (err) => {
          if (!err) {
            client.srem(symbol, entryKeys, (serr) => {
              if (!serr) {
                return resolve();
              }
              logger.error(`removing entry-keys for symbol '${symbol}'`, serr);
              return reject(serr);
            });
          } else {
            logger.error(`removing entries for symbol '${symbol}'`, err);
            return reject(err);
          }
        })
      : resolve()
  );

interface DailyQuoteHash {
  [key: string]: string;
}

const dailyQuoteToHash = (dailyQuote: DailyQuote): DailyQuoteHash =>
  Object.assign(
    {},
    ...Object.keys(dailyQuote).map((k) => ({
      [k]: String((dailyQuote as { [key: string]: any })[k]),
    }))
  );

const hashToDailyQuote = (hash: DailyQuoteHash): DailyQuote =>
  ({
    symbol: getOrThrow<SymbolName>('symbol', hash),
    date: new Date(getOrThrow<string>('date', hash)),
    open: Number(getOrThrow<string>('open', hash)),
    high: Number(getOrThrow<string>('high', hash)),
    low: Number(getOrThrow<string>('low', hash)),
    close: Number(getOrThrow<string>('close', hash)),
    volume: Number(getOrThrow<string>('volume', hash)),
  } as DailyQuote);

/**
 * Insert a new quote for the given symbol with key '<symbol>:<date ISO string>'
 * and add it to the set of entries of the symbol.
 * @param symbol Name of the symbol
 * @param quote The quote information
 */
const insertNewQuote = async (
  symbol: SymbolName,
  quote: DailyQuote
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const entryKey = `${symbol}:${quote.date.toISOString()}`;
    client.hmset(entryKey, dailyQuoteToHash(quote), (err) => {
      if (!err) {
        client.sadd(symbol, entryKey, (serr) => {
          if (!serr) {
            return resolve();
          }
          logger.error(
            `adding entry-key '${entryKey}' for symbol '${symbol}'`,
            serr
          );
          return reject(serr);
        });
      } else {
        logger.error(`inserting quote for key '${entryKey}'`, err);
        return reject(err);
      }
    });
  });

/**
 * Fetch a quote, specified by the given key, from the cache.
 * @param entryKey The key specifying the quote to fetch
 */
const getQuote = async (entryKey: string): Promise<DailyQuote> =>
  new Promise<DailyQuote>((resolve, reject) =>
    client.hgetall(entryKey, (err, res: DailyQuoteHash) => {
      if (!err) {
        return resolve(hashToDailyQuote(res));
      }
      logger.error(
        `fetching time series quote from cache for key ${entryKey}`,
        err
      );
      return reject(err);
    })
  );

/**
 * Inserts the given list of symbols into the cache.
 * Ignores already existing symbols.
 * @param symbols List of symbols to insert
 */
const insertNewSymbols = async (symbols: SymbolName[]): Promise<void> =>
  new Promise<void>((resolve, reject) =>
    client.sadd(SYMBOL_SET, symbols, (err) => {
      if (!err) {
        return resolve();
      }
      logger.error(`inserting new symbols to cache`, err);
      return reject(err);
    })
  );

const populateCache = async (symbols?: SymbolName[]): Promise<void> => {
  const symbolNames = symbols !== undefined ? symbols : SUPPORTED_SYMBOLS;

  try {
    await insertNewSymbols(symbolNames);

    const intraDaySeries: DailyQuote[][] = (await Promise.all(
      symbolNames.map(async (symbol) =>
        getAvIntraDaySeries(symbol).catch(() => undefined)
      )
    )).filter(
      (quotes) => quotes !== undefined && quotes.length > 0
    ) as DailyQuote[][];

    await Promise.all(
      intraDaySeries.map((quotes: DailyQuote[]) =>
        insertNewIntraDaySeries(quotes[0].symbol, quotes)
      )
    );
  } catch (error) {
    logger.error('populating cache', error);
    throw error;
  }
};

/**
 * Completely flush the redis store.
 */
const flushCache = async (): Promise<void> =>
  new Promise<void>((resolve, reject) =>
    client.flushdb((err) => {
      if (!err) {
        return resolve();
      }
      logger.error('flushing cache', err);
      reject(err);
    })
  );

/**
 * Fetch the intraday series for the given symbol.
 * @param symbol The symbol for which to fetch the series data.
 */
const getIntraDaySeries = async (symbol: SymbolName): Promise<DailyQuote[]> => {
  try {
    const entryKeys = await getEntryKeys(symbol);
    return Promise.all(
      entryKeys
        .sort()
        .reverse()
        .map((key) => getQuote(key))
    );
  } catch (error) {
    logger.error('fetching intraday series from cache', error);
    throw error;
  }
};

const getLatestIntraDayQuotes = async (
  symbol: SymbolName
): Promise<DailyQuote | undefined> => {
  try {
    const symbolSeries = await getIntraDaySeries(symbol);
    return symbolSeries.length !== 0 ? symbolSeries[0] : undefined;
  } catch (error) {
    logger.error(
      `fetching latest intraday series entry for symbol ${symbol}`,
      error
    );
    throw error;
  }
};

export {
  populateCache,
  flushCache,
  getIntraDaySeries,
  getLatestIntraDayQuotes,
};
