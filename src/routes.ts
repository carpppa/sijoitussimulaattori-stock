import { Request, Response } from 'express';
import * as express from 'express';
import * as validation from 'express-joi-validation';

import { helloName } from './validation';
import { getAvDailySeries, getAvGlobalQuote } from './services/alpha-vantage';

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

    app.route('/stock').get(async (req: Request, res: Response) => {
      try {
        const quote = await getAvGlobalQuote('AAPL');
        res.json(quote);
      } catch (error) {
        res.boom.badImplementation();
      }
    });
  }
}
