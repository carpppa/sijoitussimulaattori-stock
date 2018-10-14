import { Request, Response } from 'express';
import * as express from 'express';
import * as validation from 'express-joi-validation';

import { helloName } from './validation';

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
  }
}
