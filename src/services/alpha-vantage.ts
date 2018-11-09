import axios, { AxiosResponse } from 'axios';
import * as nock from 'nock';

import config from '../config';
import { logger } from '../util/logger';
import { avDailySeriesCompact, avGlobalQuote } from './__tests__/alpha-vantage-mock-data';

type EquitySymbol = 'AAPL' | 'AMZN' | 'BABA' | 'BAC' | 'DIS' | 'GOOGL';
type AvQueryOutputSize = 'compact' | 'full';

interface AvRequestQueryParams {
  function: 'TIME_SERIES_DAILY' | 'GLOBAL_QUOTE';
  symbol?: EquitySymbol;
  outputsize?: AvQueryOutputSize;
}

type ShortTimestamp = string; // YYYY-MM-DD
type LongTimestamp = string; // YYYY-MM-DD HH:MM:SS

interface AvGlobalQuote {
  'Global Quote': {
    '01. symbol': EquitySymbol;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': ShortTimestamp;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
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
    '2. Symbol': EquitySymbol;
    '3. Last Refreshed': ShortTimestamp;
    '4. Output Size': 'Compact' | 'Full size';
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [timestamp: string]: AvDailyQuote;
  };
}

interface DailyQuote {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const makeAvRequest = async <T>(queryParams: AvRequestQueryParams) => {
  try {
    return (await axios({
      method: 'get',
      url: `${config.app.ALPHA_VANTAGE_URL}/query`,
      params: { ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY },
    })) as AxiosResponse<T>;
  } catch (error) {
    logger.debug('Alpha Vantage request failed', error);
    throw error;
  }
};

const getAvGlobalQuote = async (symbol: EquitySymbol) => {
  try {
    const queryParams: AvRequestQueryParams = {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
    };

    if (config.app.NODE_ENV !== 'production') {
      nock(config.app.ALPHA_VANTAGE_URL)
        .get('/query')
        .query({ ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY })
        .reply(200, avGlobalQuote);
    }

    const quoteResponse = await makeAvRequest<AvGlobalQuote>(queryParams);

    return quoteResponse.data;
  } catch (error) {
    // TODO: prettify error here?
    logger.error('Stock global quote request fail', error);
    throw error;
  }
};

const getAvDailySeries = async (
  symbol: EquitySymbol,
  outputSize: AvQueryOutputSize = 'compact'
) => {
  try {
    const queryParams: AvRequestQueryParams = {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: outputSize,
    };

    if (config.app.NODE_ENV !== 'production') {
      nock(config.app.ALPHA_VANTAGE_URL)
        .get('/query')
        .query({ ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY })
        .reply(200, avDailySeriesCompact);
    }

    const avDailySeries = await makeAvRequest<AvDailySeries>(queryParams);

    const avTimeSeries = Object.values(
      avDailySeries.data['Time Series (Daily)']
    );
    const dailySeries = Object.keys(
      avDailySeries.data['Time Series (Daily)']
    ).map(
      (key, index) =>
        ({
          symbol: symbol,
          date: new Date(key),
          open: Number.parseFloat(avTimeSeries[index]['1. open']),
          high: Number.parseFloat(avTimeSeries[index]['2. high']),
          low: Number.parseFloat(avTimeSeries[index]['3. low']),
          close: Number.parseFloat(avTimeSeries[index]['4. close']),
          volume: Number.parseInt(avTimeSeries[index]['5. volume']),
        } as DailyQuote)
    );

    return dailySeries;
  } catch (error) {
    // TODO
    logger.error('Stock daily series request fail', error);
    throw error;
  }
};

export { EquitySymbol, DailyQuote, getAvGlobalQuote, getAvDailySeries };
