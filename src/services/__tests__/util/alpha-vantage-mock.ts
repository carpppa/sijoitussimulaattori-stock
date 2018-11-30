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

const intradayData: DailyQuote[] = [
  {
    symbol: 'AAPL',
    date: new Date('2018-11-29 15:50:00'),
    open: 179.94,
    high: 180.05,
    low: 179.81,
    close: 179.82,
    volume: 606523,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-29 15:45:00'),
    open: 179.77,
    high: 179.95,
    low: 179.76,
    close: 179.95,
    volume: 341296,
  },
];

const intradayLatestData: DailyQuote[] = [
  {
    symbol: 'AAPL',
    date: new Date('2018-11-29 16:00:00'),
    open: 179.86,
    high: 179.86,
    low: 179.5,
    close: 179.55,
    volume: 1164136,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-29 15:55:00'),
    open: 179.83,
    high: 179.94,
    low: 179.66,
    close: 179.8547,
    volume: 604670,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-29 15:50:00'),
    open: 179.94,
    high: 180.05,
    low: 179.81,
    close: 179.82,
    volume: 606523,
  },
  {
    symbol: 'AAPL',
    date: new Date('2018-11-29 15:45:00'),
    open: 179.77,
    high: 179.95,
    low: 179.76,
    close: 179.95,
    volume: 341296,
  },
];

export {
  mockAvEndpoint,
  symbolData,
  dailySeriesData,
  dailySeriesLatestData,
  intradayData,
  intradayLatestData,
};
