import * as Joi from 'joi';
import { SUPPORTED_SYMBOLS } from './services/alpha-vantage';

const helloName = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().optional(),
  }).required(),
});

const equitySymbol = Joi.object({
  symbol: Joi.string()
    .valid(SUPPORTED_SYMBOLS)
    .required(),
});

const dailyQuotes = Joi.array().items(
  Joi.object({
    symbol: Joi.string().required(),
    date: Joi.date()
      .iso()
      .required(),
    open: Joi.number().required(),
    high: Joi.number().required(),
    low: Joi.number().required(),
    close: Joi.number().required(),
    volume: Joi.number().required(),
  })
);

export { equitySymbol, dailyQuotes, helloName };
