import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publicationYear: Joi.number().required(),
  isbn: Joi.string().required(),
  genre: Joi.array().items(Joi.string().required()).required(),
  description: Joi.string().required(),
}).options({ abortEarly: false });

export default schema;
