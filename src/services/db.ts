import { client, DatabaseTables } from '../db';
import { logger } from '../util/logger';
import { DailyQuote, EquitySymbol, getAvDailySeries } from './alpha-vantage';

const getDailySeries = async (symbol: string) => {
  try {
    return (await client
      .select()
      .from(DatabaseTables.DailyQuotes)
      .where('symbol', symbol)) as DailyQuote[];
  } catch (error) {
    logger.debug(`fetching daily series for symbol ${symbol}`, error);
    throw error;
  }
};

const populateDb = async () => {
  // TODO: fetch these from the database:
  const symbols: EquitySymbol[] = ['AAPL']; //, 'AMZN', 'BABA', 'BAC', 'DIS', 'GOOGL'];

  try {
    const symbolsSeriesData: DailyQuote[][] = await Promise.all(
      symbols.map((symbol) => getAvDailySeries(symbol))
    );

    const dbQueries = await Promise.all(
      symbolsSeriesData.map((dailyQuotes: DailyQuote[]) =>
        client(DatabaseTables.DailyQuotes).insert(dailyQuotes)
      )
    );
  } catch (error) {
    logger.error('populate database', error);
  }
};

export { getDailySeries, populateDb };
