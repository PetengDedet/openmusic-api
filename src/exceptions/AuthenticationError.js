const ClientEror = require('./ClientError');

class AuthenticationError extends ClientEror {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
