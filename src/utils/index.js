const mapDBToModelAlbum = ({id,name,year,})=>({id,name,year});
const mapDBToModelAlbumDetail = ({id,name,year,songs})=>({id,name,year,songs});
const mapDBToModelSong = ({id,title,year,performer,genre,duration,albumId,})=>({id, title,year,performer,genre,duration,albumId});

module.exports = {mapDBToModelAlbum,mapDBToModelSong,mapDBToModelAlbumDetail};