require('dotenv').config();

const Hapi = require('@hapi/hapi');
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
  console.log('<<ERROR------>>', response);
  if (response.isBoom) {
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
  ]);

  await server.start();
  console.log(`Running server at ${process.env.HOST}:${process.env.PORT}`);
};

init();
