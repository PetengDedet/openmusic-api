require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const preResponse = (request, h) => {
  const { response } = request;

  // 400
  if (response instanceof ClientError) {
    const newResponse = h.response({
      status: 'fail',
      message: response.message,
    });

    newResponse.code(response.statusCode);
    return newResponse;
  }

  // 500 & 404 server error
  if (response.isBoom) {
    console.log('<<ERROR------>>', response);
    const res = {
      status: 'error',
      message: 'Terjadi kesalahan server',
    };

    if (response.output.statusCode === 404) {
      res.status = 'fail';
      res.message = '404 Tidak ditemukan';
    }

    return h.response(res).code(response.output.statusCode);
  }

  return response.continue || response;
};

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // PreResponse intercept
  server.ext('onPreResponse', preResponse);

  // Registrasi plugin External
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Plugin Internal
  await server.register([
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
  ]);

  await server.start();
  console.log(`Running server at ${process.env.HOST}:${process.env.PORT}`);
};

init();
