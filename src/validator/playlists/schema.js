const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(250).required(),
});

const PlaylistSongPalyloadSchema = Joi.object({
  songId: Joi.string().length(21).required(),
});

module.exports = {
  PlaylistPayloadSchema,
  PlaylistSongPalyloadSchema,
};
