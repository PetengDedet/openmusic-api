const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(250).required(),
  fullname: Joi.string().min(1).max(250).required(),
  password: Joi.string().min(3).max(250).required(),
});

module.exports = { UserPayloadSchema };
