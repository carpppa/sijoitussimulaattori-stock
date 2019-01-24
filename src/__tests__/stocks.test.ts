import * as supertest from 'supertest';

import app from '../app';
import { dailySeriesData, intradayData, symbolData } from '../services/__tests__/util/alpha-vantage-mock';

jest.mock('../services/redis', () => ({
  getIntraDaySeries: async () => intradayData,
  getLatestIntraDayQuote: async () => intradayData[0],
}));

jest.mock('../services/db', () => ({
  getAllSymbols: async () => [symbolData],
  getDailySeries: async () => dailySeriesData,
  getLatestDailySeriesEntry: async () => dailySeriesData[0],
  getSymbol: async () => symbolData,
}));

describe('/stocks endpoint >>>', async () => {
  const server = app.listen(process.env.PORT || 3000);
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it('GET /stocks should return ?', async () => {
    const result = await request.get('/stocks');
    expect(result.status).toEqual(200);
    expect(result.body).toEqual([
      {
        close: 179.82,
        high: 180.05,
        low: 179.81,
        name: 'Apple Inc.',
        revenue: -0.1675564453342231,
        symbol: 'AAPL',
      },
    ]);
  });

  it('GET /stocks/:symbol should return metadata from given symbol', async () => {
    const result = await request.get('/stocks/AAPL');
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(symbolData);
  });

  it('GET /stocks/:symbol/history should return history for given symbol', async () => {
    const result = await request.get('/stocks/AAPL/history');
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(
      dailySeriesData.map((q) => ({ ...q, date: q.date.toISOString() }))
    );
  });

  it('GET /stocks/:symbol/intraday should return intraday data for given symbol', async () => {
    const result = await request.get('/stocks/AAPL/intraday');
    expect(result.status).toEqual(200);
    expect(result.body).toEqual(
      intradayData.map((q) => ({ ...q, date: q.date.toISOString() }))
    );
  });
});
