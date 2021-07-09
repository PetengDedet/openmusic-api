const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postUploadPictureHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000,
      },
    },
  },
  {
    method: 'GET',
    path: '/assets/{params*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../../../assets/'),
      },
    },
  },
];

module.exports = routes;
