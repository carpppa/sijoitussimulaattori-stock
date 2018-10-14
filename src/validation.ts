import * as Joi from 'joi';

const helloName = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().optional(),
  }).required(),
});

export { helloName };
