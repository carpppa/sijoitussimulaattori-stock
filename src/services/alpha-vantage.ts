import axios, { AxiosResponse } from 'axios';
import config from '../config';
import logger from '../util/logger';

type SupportedSymbols = 'AAPL' | 'AMZN' | 'BABA' | 'BAC' | 'DIS' | 'GOOGL';
type AvQueryOutputSize = 'compact' | 'full';

interface AvRequestQueryParams {
  function: 'TIME_SERIES_DAILY' | 'GLOBAL_QUOTE';
  symbol?: SupportedSymbols;
  outputsize?: AvQueryOutputSize;
}

type ShortTimestamp = string; // YYYY-MM-DD
type LongTimestamp = string; // YYYY-MM-DD HH:MM:SS

interface AvGlobalQuote {
  'Global quote': {
    '01. symbol': SupportedSymbols;
    '02. open': number;
    '03. high': number;
    '04. low': number;
    '05. price': number;
    '06. volume': number;
    '07. latest trading day': ShortTimestamp;
    '08. previous close': number;
    '09. change': number;
    '10. change percent': string;
  };
}

interface AvDailyQuote {
  [timestamp: string]: {
    '1. open': number;
    '2. high': number;
    '3. low': number;
    '4. close': number;
    '5. volume': number;
  };
}

interface AvDailySeries {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': SupportedSymbols;
    '3. Last Refreshed': ShortTimestamp;
    '4. Output Size': 'Compact' | 'Full size';
    '5. Time Zone': string;
  };
  'Time Series (Daily)': AvDailyQuote[];
}

const makeAvRequest = async <T>(queryParams: AvRequestQueryParams) => {
  try {
    return (await axios({
      method: 'get',
      url: 'https://www.alphavantage.co/query',
      params: { ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY },
    })) as AxiosResponse<T>;
  } catch (error) {
    logger.debug('Alpha Vantage request failed', error);
    throw error;
  }
};

const getAvGlobalQuote = async (symbol: SupportedSymbols) => {
  try {
    const quoteResponse = await makeAvRequest<AvGlobalQuote>({
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
    });
    logger.debug('test query', {
      status: quoteResponse.status,
      statusText: quoteResponse.statusText,
      data: quoteResponse.data,
    });
    return quoteResponse.data;
  } catch (error) {
    // TODO: prettify error here?
    throw error;
  }
};

const getAvDailySeries = async (
  symbol: SupportedSymbols,
  outputSize: AvQueryOutputSize = 'compact'
) => {
  try {
    const dailySeries = await makeAvRequest<AvDailySeries>({
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: outputSize,
    });
    // TODO
    return dailySeries.data;
  } catch (error) {
    // TODO
    throw error;
  }
};

export { getAvGlobalQuote, getAvDailySeries };
