const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(250).required(),
});

module.exports = {
  PlaylistPayloadSchema,
};
