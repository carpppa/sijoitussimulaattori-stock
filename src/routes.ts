import { Request, Response } from 'express';
import * as express from 'express';
import * as validation from 'express-joi-validation';
import * as Joi from 'joi';
import * as swaggerUi from 'swagger-ui-express';

<<<<<<< HEAD
import * as swaggerDocument from './docs/swagger.json';
import { getDailySeries, getStockListing } from './services/db';
import { getIntraDaySeries } from './services/redis';
import { dailyQuotes, equitySymbol, helloName, stockListing } from './validation';
=======
import { getAllSymbols, getDailySeries, getLatestDailySeriesEntry, getSymbol } from './services/db';
import { getIntraDaySeries, getLatestIntraDaySeries } from './services/redis';
import { Stock } from './services/stock-data-types';
import { allStockData, dailyQuotes, equitySymbol, helloName, stockListing } from './validation';
>>>>>>>  Implemented the API-endpoints for stock-data

export class Routes {
  private validator = validation({ passError: true });

  public routes(app: express.Application): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'Hello, World!',
      });
    });

    app
      .route('/hello')
      .get(this.validator.body(helloName), (req: Request, res: Response) => {
        res.status(200).send({
          message: `Hello, ${req.body.name.first}!`,
        });
      });

    app
      .route('/stock/:symbol')
      .get(
        this.validator.params(equitySymbol),
        async (req: Request, res: Response) => {
          try {
            const dailyQuotes = await getDailySeries(req.params.symbol);
            const intraDay = await getIntraDaySeries(req.params.symbol);
            const symbols = await getSymbol(req.params.symbol);

            const combinedData = { dailyQuotes, intraDay, symbols };
            Joi.assert(combinedData, allStockData);
            res.json(combinedData);
          } catch (error) {
            res.boom.badImplementation();
          }
        }
      );

    app
      .route('/stock/:symbol/history')
      .get(
        this.validator.params(equitySymbol),
        async (req: Request, res: Response) => {
          try {
            const quotes = await getDailySeries(req.params.symbol);

            Joi.assert(quotes, dailyQuotes);
            res.json(quotes);
          } catch (error) {
            res.boom.badImplementation();
          }
        }
      );

    app
      .route('/stock/:symbol/intraday')
      .get(
        this.validator.params(equitySymbol),
        async (req: Request, res: Response) => {
          try {
            const intraday = await getIntraDaySeries(req.params.symbol);

            Joi.assert(intraday, dailyQuotes);
            res.json(intraday);
          } catch (error) {
            res.boom.badImplementation();
          }
        }
      );

    app.route('/stocks').get(async (req: Request, res: Response) => {
      try {
        const symbols = await getAllSymbols();
        const stocks = await Promise.all(
          symbols.map(
            async (symbol): Promise<Stock> => {
              const latestDailySeries = await getLatestDailySeriesEntry(
                symbol.symbol
              );
              const latestIntraDaySeries = await getLatestIntraDaySeries(
                symbol.symbol
              );
              if (
                latestDailySeries == undefined ||
                latestIntraDaySeries == undefined
              ) {
                return Object.assign({});
              } else {
                return Object.assign({
                  symbol: symbol.symbol,
                  name: symbol.name,
                  high: latestIntraDaySeries.high,
                  low: latestIntraDaySeries.low,
                  revenue:
                    (latestIntraDaySeries.close - latestDailySeries.close) /
                    latestDailySeries.close,
                  close: latestIntraDaySeries.close,
                });
              }
            }
          )
        );
        Joi.assert(stocks, stockListing);
        res.json(stocks);
      } catch (error) {
        res.boom.badImplementation();
      }
    });
  }
}
