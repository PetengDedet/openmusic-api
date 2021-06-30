class PlaylistHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
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
}

module.exports = PlaylistHandler;
