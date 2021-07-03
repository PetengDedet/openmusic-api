const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    let { playlistId, userId } = request.payload;
    playlistId = playlistId.substr(9, 16);
    userId = userId.substr(5, 16);
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(
      playlistId,
      credentialId,
    );

    const isUserExists = await this._collaborationsService.verifyUserExistsInPlaylist(
      playlistId,
      userId,
    );

    if (isUserExists) {
      throw new ClientError('User sudah ada di dalam daftar kolaborasi', 400);
    }

    const collabId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId,
    );

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId: `collab-${collabId}`,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);

    let { playlistId, userId } = request.payload;
    playlistId = playlistId.substr(9, 16);
    userId = userId.substr(5, 16);
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(
      playlistId,
      credentialId,
    );

    const isUserExists = await this._collaborationsService.verifyUserExistsInPlaylist(
      playlistId,
      userId,
    );

    if (!isUserExists) {
      throw new ClientError('User tidak terdaftar dalam kolaborasi', 400);
    }

    await this._collaborationsService.deleteCollaboration(
      playlistId,
      userId,
    );

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
