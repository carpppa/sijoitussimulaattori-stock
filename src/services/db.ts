import { client, DatabaseTables, DailyQuotesTable } from '../db';
import { logger } from '../util/logger';
import {
  DailyQuote,
  EquitySymbol,
  getAvDailySeries,
  SUPPORTED_SYMBOLS,
} from './alpha-vantage';
import { isUndefined } from 'util';

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

const populateDb = async () => {
  const newSymbols: EquitySymbol[] = [];

  try {
    const symbolsSeriesData: (DailyQuote[] | undefined)[] = await Promise.all(
      SUPPORTED_SYMBOLS.map((symbol) =>
        getAvDailySeries(
          symbol,
          newSymbols.includes(symbol) ? 'full' : 'compact'
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
            return dailyQuotes.slice(
              0,
              dailyQuotes.findIndex((quote) => quote.date > latestQuote.date)
            );
          } catch (error) {
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
  }
};

export { getDailySeries, populateDb };
