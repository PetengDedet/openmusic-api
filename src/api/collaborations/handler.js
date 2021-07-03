class CollaborationsHandler {
  constructor(collaborationsService, validator) {
    this._collaborationsService = collaborationsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request) {
    return 'OKE';
  }
}

module.exports = CollaborationsHandler;
