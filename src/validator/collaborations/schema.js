const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().length(25).required(),
  userId: Joi.string().length(21).required(),
});

module.exports = { CollaborationPayloadSchema };
