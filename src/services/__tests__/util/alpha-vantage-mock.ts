import nock = require('nock');

import config from '../../../config';
import { DailyQuote, Symbol } from '../../../services/stock-data-types';
import { AvRequestQueryParams } from '../../alpha-vantage';

const mockAvEndpoint = <T>(
  queryParams: AvRequestQueryParams,
  statusCode: number,
  response: T
): void => {
  nock(config.app.ALPHA_VANTAGE_URL)
    .get('/query')
    .query({ ...queryParams, apikey: config.app.ALPHA_VANTAGE_API_KEY })
    .reply(statusCode, response);
};

const symbolData: Symbol = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  type: 'Equity',
  region: 'United States',
  marketOpen: '09:30',
  marketClose: '16:00',
  timeZone: 'UTC-05',
  currency: 'USD',
};

const dailySeriesData: DailyQuote[] = [
  {
    symbol: 'AAPL',
    date: new Date('2018-11-07'),
    open: 205.97,
    high: 210.06,
    low: 204.13,
    close: 209.95,
    volume: 33424434,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-06'),
    open: 201.92,
    high: 204.72,
    low: 201.69,
    close: 203.77,
    volume: 31882881,
  },
];

const dailySeriesLatestData: DailyQuote[] = [
  {
    symbol: 'AAPL',
    date: new Date('2018-11-09'),
    open: 205.55,
    high: 206.01,
    low: 202.25,
    close: 204.47,
    volume: 34365750,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-08'),
    open: 209.98,
    high: 210.12,
    low: 206.75,
    close: 208.49,
    volume: 25362636,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-07'),
    open: 205.97,
    high: 210.06,
    low: 204.13,
    close: 209.95,
    volume: 33424434,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-06'),
    open: 201.92,
    high: 204.72,
    low: 201.69,
    close: 203.77,
    volume: 31882881,
  },
];

export { mockAvEndpoint, symbolData, dailySeriesData, dailySeriesLatestData };
