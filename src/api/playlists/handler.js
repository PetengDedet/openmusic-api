const ClientError = require("../../exceptions/ClientError");

class PlaylistHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.postPlaylistSongs = this.postPlaylistSongs.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: `playlist-${playlistId}`,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getNotes(credentialId);

    return {
      status: 'success',
      data: {
        playlists: playlists.map((p) => ({
          ...p,
          id: `playlist-${p.id}`,
        })),
      },
    };
  }

  async postPlaylistSongs(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    let { playlistId = '' } = request.params;
    let { songId } = request.payload;
    playlistId = playlistId.substr(9, 16);
    songId = songId.substr(5, 16);
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(
      playlistId,
      credentialId,
    );

    const isSongExists = await this._playlistsService.verifySongExistsInPlaylist(
      playlistId,
      songId,
    );

    if (isSongExists) {
      throw new ClientError('Gagal menambahkan lagu ke playlist. Lagu sudah terdaftar.');
    }

    await this._playlistsService.addSongToPlaylist(
      playlistId,
      songId,
    );

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  }
}

module.exports = PlaylistHandler;
