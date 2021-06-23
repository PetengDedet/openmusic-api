const ClientError = require('../../exceptions/ClientError');
// const ServerError = require('../../exceptions/ServerError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async getSongsHandler(_, h) {
    try {
      const songs = await this._service.getSongs();

      return h.response({
        status: 'success',
        data: {
          songs: songs.map((s) => ({
            id: `song-${s.id}`,
            title: s.title,
            performer: s.performer,
          })),
        },
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'fail',
        message: 'Terjadi kesalahan internal',
      }).code(500);
    }
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title, year, performer, genre, duration,
      } = request.payload;

      const songId = await this._service.addSong({
        title, year, performer, genre, duration,
      });

      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: `song-${songId}`,
        },
      }).code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }

      return h.response({
        status: 'fail',
        message: 'Gagal menyimpan lagu. Kesalahan server',
      }).code(500);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getSongById(songId.substring(5, 21));
      return h.response({
        status: 'success',
        data: {
          song: {
            ...song,
            id: `song-${song.id}`,
          },
        },
      }).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'fail',
        message: 'Terjadi kesalahan server',
      }).code(500);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const { songId } = request.params;
      const {
        title, year, performer, genre, duration,
      } = request.payload;

      await this._service.editSongById(
        songId.substring(5, 21),
        {
          title, year, performer, genre, duration,
        },
      );

      return h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      }).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'fail',
        message: error.message,
      }).code(500);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._service.deleteSongById(songId.substring(5, 21));
      return h.response({
        status: 'success',
        message: 'lagu berhasil dihapus',
      }).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }

      return h.response({
        status: 'fail',
        message: 'Kesalahan server',
      }).code(500);
    }
  }
}

module.exports = SongsHandler;
