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

  async getSongsHandler() {
    const songs = await this._service.getSongs();

    return {
      status: 'success',
      data: {
        songs: songs.map((s) => ({
          id: `song-${s.id}`,
          title: s.title,
          performer: s.performer,
        })),
      },
    };
  }

  async postSongHandler(request, h) {
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
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId.substring(5, 21));
    return {
      status: 'success',
      data: {
        song: {
          ...song,
          id: `song-${song.id}`,
        },
      },
    };
  }

  async putSongByIdHandler(request) {
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

    return {
      status: 'success',
      message: 'lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;
    await this._service.deleteSongById(songId.substring(5, 21));
    return {
      status: 'success',
      message: 'lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
