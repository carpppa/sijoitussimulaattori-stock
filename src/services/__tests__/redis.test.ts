import nock = require('nock');

import { closeConnection } from '../../redis';
import { flushCache, getIntraDaySeries, populateCache } from '../redis';
import { intradayData, intradayLatestData, intradayNewDayData, mockAvEndpoint } from './util/alpha-vantage-mock';
import * as intradaySeriesLatest from './util/data/intraday-series-latest.json';
import * as intradaySeriesNewDay from './util/data/intraday-series-new-day.json';
import * as intradaySeries from './util/data/intraday-series.json';

describe('Redis cache', async () => {
  beforeAll(async () => {
    await flushCache();
  });

  afterAll(async () => {
    await flushCache();
    await closeConnection();
  });

  it('should be populated correctly when initially empty', async () => {
    // Mock the AV endpoint:
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

    await populateCache(['AAPL']);

    const cacheSeries = await getIntraDaySeries('AAPL');
    expect(cacheSeries).toEqual(intradayData);

    expect(nock.pendingMocks().length).toEqual(0);
  });

  it('should be populated correctly when has previous data', async () => {
    // Mock the AV endpoint:
    mockAvEndpoint(
      {
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'AAPL',
        interval: '5min',
        outputsize: 'compact',
      },
      200,
      intradaySeriesLatest
    );

    await populateCache(['AAPL']);

    const cacheSeries = await getIntraDaySeries('AAPL');
    expect(cacheSeries).toEqual(intradayLatestData);

    expect(nock.pendingMocks().length).toEqual(0);
  });

  it('should be populated correctly when has data from yesterday', async () => {
    // Mock the AV endpoint:
    mockAvEndpoint(
      {
        function: 'TIME_SERIES_INTRADAY',
        symbol: 'AAPL',
        interval: '5min',
        outputsize: 'compact',
      },
      200,
      intradaySeriesNewDay
    );

    await populateCache(['AAPL']);

    const cacheSeries = await getIntraDaySeries('AAPL');
    expect(cacheSeries).toEqual(intradayNewDayData);

    expect(nock.pendingMocks().length).toEqual(0);
  });
});
