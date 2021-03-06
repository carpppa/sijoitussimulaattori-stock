import * as Joi from 'joi';

import { SUPPORTED_SYMBOLS } from './services/stock-data-types';

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

const stockData = Joi.object({
  symbol: Joi.string().required(),
  name: Joi.string().required(),
  high: Joi.number().required(),
  low: Joi.number().required(),
  revenue: Joi.number().required(),
  close: Joi.number().required(),
});

const metaData = Joi.object({
  symbol: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  region: Joi.string().required(),
  marketOpen: Joi.string().required(),
  marketClose: Joi.string().required(),
  timeZone: Joi.string().required(),
  currency: Joi.string().required(),
});

const stockListing = Joi.array().items(stockData);

export {
  equitySymbol,
  dailyQuotes,
  helloName,
  stockListing,
  stockData,
  metaData,
};
