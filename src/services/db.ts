import { client, DatabaseTables, DailyQuotesTable, SymbolsTable } from '../db';
import { logger } from '../util/logger';
import {
  DailyQuote,
  SymbolName,
  getAvDailySeries,
  SUPPORTED_SYMBOLS,
  Symbol,
  getAvSymbolMetaData,
} from './alpha-vantage';
import { isUndefined } from 'util';
import { exist } from 'joi';

const getDailySeries = async (symbol: string) => {
  try {
    return (await client
      .select()
      .from(DatabaseTables.DailyQuotes)
      .where(DailyQuotesTable.Symbol, symbol)) as DailyQuote[];
  } catch (error) {
    logger.error(`fetching daily series for symbol ${symbol}`, error);
    throw error;
  }
};

const getSymbolNames = async () => {
  try {
    return (await client
      .select(SymbolsTable.Symbol)
      .from(DatabaseTables.Symbols)) as Symbol[];
  } catch (error) {
    logger.error('fetching symbols', error);
    throw error;
  }
};

const getLatestDailySeriesEntry = async (symbol: string) => {
  try {
    return (await client
      .first()
      .from(DatabaseTables.DailyQuotes)
      .where(DailyQuotesTable.Symbol, symbol)) as DailyQuote;
  } catch (error) {
    logger.error(
      `fetching latest daily series entry for symbol ${symbol}`,
      error
    );
    throw error;
  }
};

const insertNewSymbol = async (symbol: SymbolName) => {
  const symbolData = await getAvSymbolMetaData(symbol);
  try {
    await client(DatabaseTables.Symbols).insert(symbolData);
  } catch (error) {
    logger.error(`failed to create database entry for symbol ${symbol}`, error);
    throw error;
  }
};

const populateDb = async () => {
  try {
    const existingSymbols = (await getSymbolNames()).map(
      (equity) => equity.symbol as SymbolName
    );
    const newSymbols: SymbolName[] = SUPPORTED_SYMBOLS.filter(
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
      SUPPORTED_SYMBOLS.map(async (symbol) =>
        getAvDailySeries(
          symbol,
          insertedSymbols
            .filter((symbol) => !isUndefined(symbol))
            .includes(symbol)
            ? 'full'
            : 'compact'
        ).catch(() => undefined)
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
                  0,
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

export { getDailySeries, populateDb };
