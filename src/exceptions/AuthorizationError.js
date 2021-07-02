const ClientEror = require('./ClientError');

class AuthorizationError extends ClientEror {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
