const Joi = require('joi');

const AlbumPayLoadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().integer().required(),
});

const SongPayLoadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().integer(),
    albumId: Joi.string(),
})

module.exports={AlbumPayLoadSchema, SongPayLoadSchema};