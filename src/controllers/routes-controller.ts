import { getAllSymbols, getDailySeries, getLatestDailySeriesEntry, getSymbol } from '../services/db';
import { getIntraDaySeries, getLatestIntraDaySeries } from '../services/redis';
import { Stock, SymbolName } from '../services/stock-data-types';

const getAllStockData = async (symbol: SymbolName): Promise<any> => {
  const history = await getDailySeries(symbol);
  const intraday = await getIntraDaySeries(symbol);
  const metaData = await getSymbol(symbol);
  console.log(metaData[0]);
  return {
    symbol: metaData[0].symbol,
    name: metaData[0].name,
    type: metaData[0].type,
    region: metaData[0].region,
    marketOpen: metaData[0].marketOpen,
    marketClose: metaData[0].marketClose,
    timeZone: metaData[0].timeZone,
    currency: metaData[0].currency,
    dailyQuotes: history,
    intraDay: intraday,
  };
};

function isStock(
  stock: Promise<Stock | undefined>,
  index: number,
  array: Promise<Stock | undefined>[]
): stock is Promise<Stock> {
  return stock !== undefined;
}

const getStockListing = async (): Promise<(Stock)[]> => {
  const symbols = await getAllSymbols();
  const stocks = await Promise.all(
    symbols
      .map(
        async ({ symbol, name }): Promise<Stock | undefined> => {
          const daily = await getLatestDailySeriesEntry(symbol);
          const intraDay = await getLatestIntraDaySeries(symbol);
          return daily == undefined || intraDay == undefined
            ? undefined
            : {
                symbol: symbol,
                name: name,
                high: intraDay.high,
                low: intraDay.low,
                revenue: (intraDay.close - daily.close) / intraDay.close,
                close: intraDay.close,
              };
        }
      )
      .filter(isStock)
  );

  return stocks;
};

export { getAllStockData, getStockListing };
