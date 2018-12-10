import { Request, Response } from 'express';
import * as express from 'express';
import * as validation from 'express-joi-validation';
import * as Joi from 'joi';
import * as swaggerUi from 'swagger-ui-express';

import { getAllStockData, getStockListing } from './controllers/routes-controller';
import * as swaggerDocument from './docs/swagger.json';
import { getDailySeries } from './services/db';
import { getIntraDaySeries } from './services/redis';
import { allStockData, dailyQuotes, equitySymbol, helloName, stockListing } from './validation';

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
            const data = await getAllStockData(req.params.symbol);
            Joi.assert(data, allStockData);
            res.json(data);
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

    app.route('/stock').get(async (req: Request, res: Response) => {
      try {
        const stocks = await getStockListing();

        Joi.assert(stocks, stockListing);
        res.json(stocks);
      } catch (error) {
        res.boom.badImplementation();
      }
    });
  }
}
