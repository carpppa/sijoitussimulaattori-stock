import { Request, Response } from 'express';
import * as express from 'express';
import * as validation from 'express-joi-validation';
import * as swaggerUi from 'swagger-ui-express';

import { getAllStockData, getHistory, getIntraday, getStockListing } from './controllers/stocks';
import * as swaggerDocument from './docs/swagger.json';
import { equitySymbol, helloName } from './validation';

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
      .route('/stocks/:symbol')
      .get(this.validator.params(equitySymbol), getAllStockData);

    app
      .route('/stocks/:symbol/history')
      .get(this.validator.params(equitySymbol), getHistory);

    app
      .route('/stocks/:symbol/intraday')
      .get(this.validator.params(equitySymbol), getIntraday);

    app.route('/stocks').get(getStockListing);
  }
}
