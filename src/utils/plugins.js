const path = require('path');

// authentications
const authentications = require('../api/authentications');
const AuthenticationsService = require('../services/postgres/AuthenticationsService');
const TokenManager = require('../tokenize/TokenManager');
const AuthenticationsValidator = require('../validator/authentications');

// songs
const songs = require('../api/songs');
const SongsService = require('../services/postgres/SongsService');
const SongsValidator = require('../validator/songs');

// Users
const users = require('../api/users');
const UsersService = require('../services/postgres/UsersService');
const UsersValidator = require('../validator/users');

// Playlists
const playlists = require('../api/playlists');
const PlaylistsService = require('../services/postgres/PlaylistsService');
const PlaylistsValidator = require('../validator/playlists');

// Collaborations
const collaborations = require('../api/collaborations');
const CollaboarionsService = require('../services/postgres/CollaborationsService');
const CollaborationsValidator = require('../validator/collaborations');

// Exports
const _exports = require('../api/exports');
const ProducerService = require('../services/rabbitmq/ProducerService');
const ExportsValidator = require('../validator/exports');

// Uploads
const uploads = require('../api/uploads');
const StorageService = require('../services/storage/StorageService');
const UploadsValidator = require('../validator/uploads');

// Instantiation
const songsService = new SongsService();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const playlistsService = new PlaylistsService();
const collaborationsService = new CollaboarionsService();
const storageService = new StorageService(path.join(__dirname, '../../assets/'));

const plugins = [
  {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlists,
    options: {
      playlistsService,
      validator: PlaylistsValidator,
    },
  },
  {
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistsService,
      validator: CollaborationsValidator,
    },
  },
  {
    plugin: _exports,
    options: {
      service: ProducerService,
      playlistsService,
      validator: ExportsValidator,
    },
  },
  {
    plugin: uploads,
    options: {
      service: storageService,
      validator: UploadsValidator,
    },
  },
];

module.exports = plugins;
