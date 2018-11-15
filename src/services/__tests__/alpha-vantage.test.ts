import nock = require('nock');

import { getAvDailySeries, getAvSymbolMetaData } from '../alpha-vantage';
import { DailyQuote, Symbol } from '../stock-data-types';
import { mockAvEndpoint } from './util/alpha-vantage-mock';
import * as dailySeries from './util/data/daily-series.json';
import * as symbolSearch from './util/data/symbol-search.json';

import 'jest';

describe('Alpha Vantage', () => {
  nock.disableNetConnect();

  it('should return requested stock meta data', async () => {
    // Mock the endpoint
    mockAvEndpoint(
      { function: 'SYMBOL_SEARCH', keywords: 'AAPL' },
      200,
      symbolSearch
    );

    const aaplSymbol: Symbol = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'Equity',
      region: 'United States',
      marketOpen: '09:30',
      marketClose: '16:00',
      timeZone: 'UTC-05',
      currency: 'USD',
    };

    const symbolMetaData = await getAvSymbolMetaData('AAPL');

    expect(symbolMetaData).toEqual(aaplSymbol);
    expect(nock.pendingMocks().length).toEqual(0);
  });

  it('should return requested stock daily series data', async () => {
    // Mock the endpoint
    mockAvEndpoint(
      {
        function: 'TIME_SERIES_DAILY',
        symbol: 'AAPL',
        outputsize: 'compact',
      },
      200,
      dailySeries
    );

    const aaplDailySeries: DailyQuote[] = [
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
    ];

    const dailySeriesData = await getAvDailySeries('AAPL', 'compact');

    expect(dailySeriesData).toEqual(aaplDailySeries);
    expect(nock.pendingMocks().length).toEqual(0);
  });
});
