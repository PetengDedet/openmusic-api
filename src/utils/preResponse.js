const ClientError = require('../exceptions/ClientError');

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

  // 500, 404, 401, & 403
  if (response.isBoom) {
    const res = {
      status: 'fail',
    };

    switch (response.output.statusCode) {
      case 404:
        res.message = '404 Tidak ditemukan';
        break;

      case 401:
        res.message = '401 Tidak diizinkan';
        break;

      case 403:
        res.message = '403 Terlarang';
        break;

      case 413:
        res.message = '413 File terlalu besar. Maksimum 500KB';
        break;

      default:
        console.log('<<-------DEBUG ERROR------>>', response);
        res.status = 'error';
        res.message = '500 Terjadi kesalahan server';
        break;
    }

    return h.response(res).code(response.output.statusCode);
  }

  return response.continue || response;
};

module.exports = preResponse;
