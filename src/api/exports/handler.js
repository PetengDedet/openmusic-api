class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    let { playlistId = '' } = request.params;
    playlistId = playlistId.substr(9, 16);
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );

    const message = {
      userId: request.auth.credentials.id,
      tagetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
