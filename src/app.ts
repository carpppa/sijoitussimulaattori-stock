import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as Joi from 'joi';
import * as boom from 'express-boom';
import { NextFunction, Request, Response } from 'express';
import { Routes } from './routes';
import { client } from './db';
import * as Knex from 'knex';
import * as expressWinston from 'express-winston';
import { logger } from './util/logger';

interface JoiExpressError extends Error {
  error: Joi.ValidationError;
}

class App {
  public app: express.Application;
  public routeProvider: Routes = new Routes();
  public dbClient: Knex;

  constructor() {
    this.app = express();
    this.routeConfig();
    this.routeProvider.routes(this.app);
    this.config();
    this.dbClient = client;
  }

  private routeConfig(): void {
    // Support application/json type post data
    this.app.use(bodyParser.json());

    // Support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // Boom HTTP errors
    this.app.use(boom());

    this.app.use(expressWinston.logger(logger));
  }

  private config(): void {
    // Joi validation
    this.app.use(
      (
        err: JoiExpressError,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        // Check if it was Joi validation error:
        const validationError = err.error as Joi.ValidationError;
        if (validationError && validationError.isJoi) {
          res.boom.badRequest(err.error.toString(), {
            validation: validationError.details.map((details) => ({
              message: details.message,
              path: details.path,
            })),
          });
        } else {
          // Not joi error, pass forward
          next(err);
        }
      }
    );
  }
}

export default new App().app;
