const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const {mapDBToModelAlbum,mapDBToModelSong,mapDBToModelAlbumDetail} = require('../utils');
const NotFoundError = require('../exceptions/NotFoundError');

class OpenMusicService{
    constructor(){
        this._pool = new Pool();
    }

    async addAlbums({name,year}){
        const id = nanoid(16);
        const query = {
            text : 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values : [id,name,year],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('catatan gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async editAlbumById(id,{name,year}){
        const query = {
            text :'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values:[name,year,id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
        }
    }

    async getAlbumById(id){
        const queryAlbum={
            text:'SELECT * FROM albums WHERE id = $1',
            values:[id],
        }

        const querySongs = {
            text: 'SELECT id,title,performer FROM songs where albumid = $1',
            values:[id],
        }
        const resultAlbum = await this._pool.query(queryAlbum);
        const resultSongs = await this._pool.query(querySongs);

        if(!resultAlbum.rows.length ){
            throw new NotFoundError('Catatan tidak ditemukan');
        }    
        if(!resultSongs.rows.length){
            return resultAlbum.rows.map(mapDBToModelAlbum)[0];
        }
        resultAlbum.rows[0].songs = resultSongs.rows;
        return resultAlbum.rows.map(mapDBToModelAlbumDetail)[0];
    }

    async deleteAlbumById(id){
        const query={
            text:'DELETE FROM albums WHERE id = $1 RETURNING id',
            values:[id],
        };

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditermukan');
        }
    }

    async addSongs({title,year,performer,genre,duration,albumId}){
        const id = nanoid(16);
        const query={
            text : 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
            values:[id,title,year,performer,genre,duration,albumId],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id){
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async editSongById(id,{title,year,performer,genre,duration,albumId}){
        const query = {
            text : 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, albumid = $6 WHERE id = $7 RETURNING id',
            values : [title,year,performer,genre,duration,albumId,id],
        }

        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async getSongs(){
        const result = await this._pool.query('SELECT id,title,performer FROM songs');
        
        return result.rows.map(mapDBToModelSong);
    }

    async getSongById(id){
        const query={
            text:'SELECT * FROM songs WHERE id = $1',
            values:[id],
        }

        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        return result.rows.map(mapDBToModelSong)[0];
    }

    async deleteSongById(id){
        const query={
            text:'DELETE FROM songs WHERE id = $1 RETURNING id',
            values:[id],
        };
        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = OpenMusicService;