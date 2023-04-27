const InvariantError = require('../exceptions/InvariantError');
const {AlbumPayLoadSchema,SongPayLoadSchema} = require('./schema');

const AlbumsValidator = {
    validateAlbumPayload:(payload)=>{
        const validationResult = AlbumPayLoadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateSongPayload:(payload)=>{
        const validationResult = SongPayLoadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
};


module.exports = AlbumsValidator;