import { Request, Response } from 'express';
import * as express from 'express';
import * as validation from 'express-joi-validation';
import * as Joi from 'joi';

import { getDailySeries } from './services/db';
import { equitySymbol, helloName, dailyQuotes } from './validation';
import { getIntraDaySeries } from './services/redis';

export class Routes {
  private validator = validation({ passError: true });

  public routes(app: express.Application): void {
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
  }
}
