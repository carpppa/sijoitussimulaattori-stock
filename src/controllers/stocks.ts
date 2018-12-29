import { Request, Response } from 'express';
import * as Joi from 'joi';

import { getAllSymbols, getDailySeries, getLatestDailySeriesEntry, getSymbol } from '../services/db';
import { getIntraDaySeries, getLatestIntraDayQuotes } from '../services/redis';
import { Stock } from '../services/stock-data-types';
import { isDefined } from '../util/general';
import { dailyQuotes, metaData, stockListing } from '../validation';

const getAllStockData = async (req: Request, res: Response) => {
  try {
    const symbol = await getSymbol(req.params.symbol);
    Joi.assert(symbol[0], metaData);
    res.json(symbol[0]);
  } catch (error) {
    res.boom.badImplementation();
  }
};

const getStockListing = async (req: Request, res: Response) => {
  try {
    const symbols = await getAllSymbols();
    const stocks = (await Promise.all(
      symbols.map(
        async ({ symbol, name }): Promise<Stock | undefined> => {
          const [daily, intraDay] = await Promise.all([
            getLatestDailySeriesEntry(symbol),
            getLatestIntraDayQuotes(symbol),
          ]);
          return daily == undefined || intraDay == undefined
            ? undefined
            : {
                symbol: symbol,
                name: name,
                high: intraDay.high,
                low: intraDay.low,
                revenue: (intraDay.close - daily.close) / intraDay.close,
                close: intraDay.close,
              };
        }
      )
    )).filter(isDefined);

    Joi.assert(stocks, stockListing);
    res.json(stocks);
  } catch (error) {
    res.boom.badImplementation();
  }
};

const getIntraday = async (req: Request, res: Response) => {
  try {
    const intraday = await getIntraDaySeries(req.params.symbol);

    Joi.assert(intraday, dailyQuotes);
    res.json(intraday);
  } catch (error) {
    res.boom.badImplementation();
  }
};

const getHistory = async (req: Request, res: Response) => {
  try {
    const quotes = await getDailySeries(req.params.symbol);

    Joi.assert(quotes, dailyQuotes);
    res.json(quotes);
  } catch (error) {
    res.boom.badImplementation();
  }
};

export { getAllStockData, getStockListing, getIntraday, getHistory };
