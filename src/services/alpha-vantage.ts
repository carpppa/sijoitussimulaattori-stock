import axios, { AxiosResponse } from 'axios';
import { isUndefined } from 'util';

import config from '../config';
import { logger } from '../util/logger';
import { PromiseQueue } from '../util/promise-queue';
import { DailyQuote, Symbol, SymbolName } from './stock-data-types';

const ALPHA_VANTAGE_MINIMUM_REQUEST_INTERVAL =
  config.app.NODE_ENV !== 'test' ? 15000 : 0; // ms
const promiseQueue = new PromiseQueue({
  interval: ALPHA_VANTAGE_MINIMUM_REQUEST_INTERVAL,
});

type AvQueryOutputSize = 'compact' | 'full';

interface AvRequestQueryParams {
  function: 'TIME_SERIES_DAILY' | 'TIME_SERIES_INTRADAY' | 'SYMBOL_SEARCH';
  symbol?: SymbolName;
  outputsize?: AvQueryOutputSize;
  keywords?: SymbolName;
  interval?: '5min' | '10min';
}

interface AvDailyQuote {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

interface AvDailySeries {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': SymbolName;
    '3. Last Refreshed': string;
    '4. Output Size': 'Compact' | 'Full size';
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [timestamp: string]: AvDailyQuote;
  };
}

interface AvIntraDaySeriesMetaData<
  Interval = AvRequestQueryParams['interval']
> {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': SymbolName;
    '3. Last Refreshed': string;
    '4. Interval': Interval;
    '5. Output Size': 'Compact' | 'Full size';
    '6. Time Zone': string;
  };
}

type TimeSeriesKey<
  Interval = AvRequestQueryParams['interval']
> = Interval extends '5min'
  ? 'Time Series (5min)'
  : Interval extends '10min'
  ? 'Time Series (10min)'
  : never;

type AvIntraDayTimeSeries<Interval = AvRequestQueryParams['interval']> = {
  [k in TimeSeriesKey<Interval>]: {
    [timestamp: string]: AvDailyQuote;
  }
};

type AvIntraDaySeries<Interval> = AvIntraDaySeriesMetaData<Interval> &
  AvIntraDayTimeSeries<Interval>;

interface AvSymbolMetaData {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

interface AvSymbolSearch {
  bestMatches: AvSymbolMetaData[];
}

const makeAvRequest = async <T>(
  queryParams: AvRequestQueryParams
): Promise<AxiosResponse<T>> => {
  try {
    return await promiseQueue.enqueue<AxiosResponse<T>>(() =>
      axios({
        method: 'get',
        url: `${config.app.ALPHA_VANTAGE_URL}/query`,
        params: { ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY },
      })
    );
  } catch (error) {
    logger.debug('Alpha Vantage request failed', error);
    throw error;
  }
};

const avTimeSeriesToDailyQuotes = (
  symbol: SymbolName,
  avTimeSeries: [string, AvDailyQuote][]
): DailyQuote[] => {
  const dailySeries = avTimeSeries.map(
    (entry) =>
      ({
        symbol: symbol,
        date: new Date(entry[0]),
        open: Number.parseFloat(entry[1]['1. open']),
        high: Number.parseFloat(entry[1]['2. high']),
        low: Number.parseFloat(entry[1]['3. low']),
        close: Number.parseFloat(entry[1]['4. close']),
        volume: Number.parseInt(entry[1]['5. volume']),
      } as DailyQuote)
  );
  return dailySeries;
};

const getAvDailySeries = async (
  symbol: SymbolName,
  outputSize: AvQueryOutputSize = 'compact'
): Promise<DailyQuote[]> => {
  try {
    const queryParams: AvRequestQueryParams = {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: outputSize,
    };

    const avDailySeries = await makeAvRequest<AvDailySeries>(queryParams);

    return avTimeSeriesToDailyQuotes(
      symbol,
      Object.entries(avDailySeries.data['Time Series (Daily)'])
    );
  } catch (error) {
    logger.error('stock daily series request fail', error);
    throw error;
  }
};

const getAvIntraDaySeries = async (
  symbol: SymbolName
): Promise<DailyQuote[]> => {
  try {
    const queryParams: AvRequestQueryParams = {
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol,
      interval: '5min',
      outputsize: 'compact',
    };

    const avIntraDaySeries = await makeAvRequest<AvIntraDaySeries<'5min'>>(
      queryParams
    );

    return avTimeSeriesToDailyQuotes(
      symbol,
      Object.entries(avIntraDaySeries.data['Time Series (5min)'])
    );
  } catch (error) {
    logger.error('stock intraday series request fail', error);
    throw error;
  }
};

const getAvSymbolMetaData = async (symbol: SymbolName): Promise<Symbol> => {
  try {
    const queryParams: AvRequestQueryParams = {
      function: 'SYMBOL_SEARCH',
      keywords: symbol,
    };

    const avSymbolSearchResults = await makeAvRequest<AvSymbolSearch>(
      queryParams
    );

    const avSymbolMetaData:
      | AvSymbolMetaData
      | undefined = avSymbolSearchResults.data.bestMatches.find(
      (symbolMetaData) => symbolMetaData['1. symbol'] === symbol
    );
    if (isUndefined(avSymbolMetaData)) {
      throw Error(`symbol "${symbol}" not found`);
    }

    return {
      symbol: symbol,
      name: avSymbolMetaData['2. name'],
      type: avSymbolMetaData['3. type'],
      region: avSymbolMetaData['4. region'],
      marketOpen: avSymbolMetaData['5. marketOpen'],
      marketClose: avSymbolMetaData['6. marketClose'],
      timeZone: avSymbolMetaData['7. timezone'],
      currency: avSymbolMetaData['8. currency'],
    } as Symbol;
  } catch (error) {
    logger.error('equity meta data request fail', error);
    throw error;
  }
};

export {
  AvRequestQueryParams,
  getAvDailySeries,
  getAvIntraDaySeries,
  getAvSymbolMetaData,
};
