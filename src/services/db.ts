import { isUndefined } from 'util';

import { client, DailyQuotesTable, DatabaseTables, SymbolsTable } from '../db';
import { logger } from '../util/logger';
import { getAvDailySeries, getAvSymbolMetaData } from './alpha-vantage';
import { DailyQuote, SUPPORTED_SYMBOLS, Symbol, SymbolName } from './stock-data-types';

const getDailySeries = async (symbol: SymbolName): Promise<DailyQuote[]> => {
  try {
    return (await client
      .select()
      .from(DatabaseTables.DailyQuotes)
      .where(DailyQuotesTable.Symbol, symbol)).reverse() as DailyQuote[];
  } catch (error) {
    logger.error(`fetching daily series for symbol ${symbol}`, error);
    throw error;
  }
};

const getAllSymbols = async (): Promise<Symbol[]> => {
  try {
    return (await client.select().from(DatabaseTables.Symbols)) as Symbol[];
  } catch (error) {
    logger.error('fetching symbols', error);
    throw error;
  }
};

<<<<<<< HEAD
const getSymbol = async (symbol: SymbolName): Promise<Symbol[]> => {
=======
const getSymbol = async (symbol: SymbolName): Promise<Symbol> => {
>>>>>>>  Implemented the API-endpoints for stock-data
  try {
    return (await client
      .select()
      .from(DatabaseTables.Symbols)
<<<<<<< HEAD
      .where(SymbolsTable.Symbol, symbol)) as Symbol[];
=======
      .where(SymbolsTable.Symbol, symbol)) as Symbol;
>>>>>>>  Implemented the API-endpoints for stock-data
  } catch (error) {
    logger.error('fetching symbols', error);
    throw error;
  }
};

const getSymbolNames = async (): Promise<Symbol[]> => {
  try {
    return (await client
      .select(SymbolsTable.Symbol)
      .from(DatabaseTables.Symbols)) as Symbol[];
  } catch (error) {
    logger.error('fetching symbols', error);
    throw error;
  }
};

const getLatestDailySeriesEntry = async (
  symbol: SymbolName
): Promise<DailyQuote | undefined> => {
  try {
    const symbolSeries = await getDailySeries(symbol);
    return symbolSeries.length !== 0 ? symbolSeries[0] : undefined;
  } catch (error) {
    logger.error(
      `fetching latest daily series entry for symbol ${symbol}`,
      error
    );
    throw error;
  }
};

/**
 * Fetches meta data from Alpha Vantage for the given symbol and
 * stores it into the database.
 */
const insertNewSymbol = async (symbol: SymbolName): Promise<void> => {
  const symbolData = await getAvSymbolMetaData(symbol);
  try {
    await client(DatabaseTables.Symbols).insert(symbolData);
  } catch (error) {
    logger.error(`failed to create database entry for symbol ${symbol}`, error);
    throw error;
  }
};

/**
 * Populates the database with the given list of symbols or with
 * the symbols that are listed in SUPPORTED_SYMBOLS.
 * If the symbol didn't exist in the database before, fetches its meta
 * data and stores it, and then fetches the available market history data.
 * For symbols that already existed, updates only the new
 * entries into the database.
 */
const populateDb = async (symbols?: SymbolName[]): Promise<void> => {
  const symbolNames = symbols !== undefined ? symbols : SUPPORTED_SYMBOLS;
  try {
    const existingSymbols = (await getSymbolNames()).map(
      (equity) => equity.symbol as SymbolName
    );
    const newSymbols: SymbolName[] = symbolNames.filter(
      (symbol) => !existingSymbols.includes(symbol)
    );

    const insertedSymbols: (SymbolName | undefined)[] = await Promise.all(
      newSymbols.map(async (symbol) =>
        insertNewSymbol(symbol)
          .then(() => symbol)
          .catch(() => undefined)
      )
    );

    const symbolsSeriesData: (DailyQuote[] | undefined)[] = await Promise.all(
      symbolNames.map(async (symbol) =>
        getAvDailySeries(
          symbol,
          insertedSymbols
            .filter((symbol) => !isUndefined(symbol))
            .includes(symbol)
            ? 'full'
            : 'compact'
        )
          .then((series: DailyQuote[]) => series.reverse())
          .catch(() => undefined)
      )
    );

    const cleanSeries: (DailyQuote[] | undefined)[] = await Promise.all(
      symbolsSeriesData
        .filter((value) => !isUndefined(value) && value.length > 0)
        .map(async (dailyQuotes: DailyQuote[]) => {
          try {
            const latestQuote = await getLatestDailySeriesEntry(
              dailyQuotes[0].symbol
            );

            return !latestQuote
              ? dailyQuotes
              : dailyQuotes.slice(
                  dailyQuotes.findIndex(
                    (quote) => quote.date > latestQuote.date
                  )
                );
          } catch (error) {
            logger.error('cleaning series', error);
            return undefined;
          }
        })
    );

    await Promise.all(
      cleanSeries
        .filter((value) => !isUndefined(value) && value.length > 0)
        .map((dailyQuotes: DailyQuote[]) =>
          client(DatabaseTables.DailyQuotes).insert(dailyQuotes)
        )
    );
  } catch (error) {
    logger.error('populating database', error);
    throw error;
  }
};

export {
  getDailySeries,
  getAllSymbols,
  populateDb,
  getLatestDailySeriesEntry,
  getSymbol,
};
