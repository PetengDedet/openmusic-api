require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const preResponse = require('./utils/preResponse');
const plugins = require('./utils/plugins');

const init = async () => {
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

  // Mendefinisikan strategy authentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Plugin Internal
  await server.register(plugins);

  await server.start();
  console.log(`Running server at ${process.env.HOST}:${process.env.PORT}`);
};

init();
