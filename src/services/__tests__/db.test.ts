import nock = require('nock');

import { client } from '../../db';
import { getAllSymbols, getDailySeries, populateDb } from '../db';
import { dailySeriesData, dailySeriesLatestData, mockAvEndpoint, symbolData } from './util/alpha-vantage-mock';
import * as dailySeriesLatest from './util/data/daily-series-latest.json';
import * as dailySeries from './util/data/daily-series.json';
import * as symbolSearch from './util/data/symbol-search.json';

import 'jest';

describe('Database', async () => {
  beforeAll(async () => {
    await client.migrate.rollback();
    await client.migrate.latest();
  });

  afterAll(async () => {
    await client.migrate.rollback();
    await client.destroy();
  });

  it('should be populated correctly when initially empty', async () => {
    // Mock the endpoints:
    mockAvEndpoint(
      { function: 'SYMBOL_SEARCH', keywords: 'AAPL' },
      200,
      symbolSearch
    );
    mockAvEndpoint(
      {
        function: 'TIME_SERIES_DAILY',
        symbol: 'AAPL',
        outputsize: 'full',
      },
      200,
      dailySeries
    );

    await populateDb(['AAPL']);

    const dbSymbols = await getAllSymbols();
    expect(dbSymbols).toEqual([symbolData]);

    const dbSeries = await getDailySeries('AAPL');
    expect(dbSeries).toEqual(dailySeriesData);

    expect(nock.pendingMocks().length).toEqual(0);
  });

  it('should be populated correctly when already contains data', async () => {
    // Mock the endpoints:
    mockAvEndpoint(
      {
        function: 'TIME_SERIES_DAILY',
        symbol: 'AAPL',
        outputsize: 'compact',
      },
      200,
      dailySeriesLatest
    );
    await populateDb(['AAPL']);

    const dbSymbols = await getAllSymbols();
    expect(dbSymbols).toEqual([symbolData]);

    const dbSeries = await getDailySeries('AAPL');
    expect(dbSeries).toEqual(dailySeriesLatestData);

    expect(nock.pendingMocks().length).toEqual(0);
  });
});
