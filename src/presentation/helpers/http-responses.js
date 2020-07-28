const MissingParamError = require('./missing-param-error');
const UnauthorizedError = require('./unauthorized-error');
const ServerSideError = require('./server-side-error');

module.exports = class HttpResponse {
  static badRequest(error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerSideError(),
    };
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    };
  }
};
