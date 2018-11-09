import * as Joi from 'joi';

const helloName = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().optional(),
  }).required(),
});

// TODO figure a better system for supported symbols
const equitySymbol = Joi.object({
  symbol: Joi.string()
    .valid('AAPL')
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
