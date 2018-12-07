import nock = require('nock');

import {
  getAvDailySeries,
  getAvSymbolMetaData,
  getAvIntraDaySeries,
} from '../alpha-vantage';
import {
  dailySeriesData,
  mockAvEndpoint,
  symbolData,
  intradayData,
} from './util/alpha-vantage-mock';
import * as dailySeries from './util/data/daily-series.json';
import * as intradaySeries from './util/data/intraday-series.json';
import * as symbolSearch from './util/data/symbol-search.json';

import 'jest';

describe('Alpha Vantage', () => {
  it('should return requested stock meta data', async () => {
    // Mock the endpoint
    mockAvEndpoint(
      { function: 'SYMBOL_SEARCH', keywords: 'AAPL' },
      200,
      symbolSearch
    );

    const aaplSymbolData = await getAvSymbolMetaData('AAPL');

    expect(aaplSymbolData).toEqual(symbolData);
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

    const aaplDailySeriesData = await getAvDailySeries('AAPL', 'compact');

    expect(aaplDailySeriesData).toEqual(dailySeriesData);
    expect(nock.pendingMocks().length).toEqual(0);
  });

  it('should return requested stock intraday series data', async () => {
    // Mock the endpoint
    mockAvEndpoint(
      {
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'AAPL',
        interval: '5min',
        outputsize: 'compact',
      },
      200,
      intradaySeries
    );

    const aaplIntraDaySeriesData = await getAvIntraDaySeries('AAPL');

    expect(aaplIntraDaySeriesData).toEqual(intradayData);
    expect(nock.pendingMocks().length).toEqual(0);
  });
});
