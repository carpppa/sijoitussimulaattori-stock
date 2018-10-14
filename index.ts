import { NextFunction, Request, Response } from 'express';
import * as boom from 'express-boom';
import * as validation from 'express-joi-validation';
import * as Joi from 'joi';

import app from './src/app';

app.use(boom());
const PORT = 3000;
const validator = validation({ passError: true });

const helloName = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().optional(),
  }).required(),
});

app.route('/').get((req: Request, res: Response) => {
  res.status(200).send({
    message: 'Hello, World!',
  });
});

app
  .route('/hello')
  .get(validator.body(helloName, {}), (req: Request, res: Response) => {
    res.status(200).send({
      message: `Hello, ${req.body.name.first}!`,
    });
  });

interface JoiExpressError extends Error {
  error: Joi.ValidationError;
}

app.use(
  (err: JoiExpressError, req: Request, res: Response, next: NextFunction) => {
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

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});
