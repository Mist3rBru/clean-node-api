const { UnauthorizedError, ServerError } = require('../../utils/errors')

module.exports = class HttpResponse {
  static ok(body) {
    return {
      status: 200,
      body: body
    }
  }

  static badRequest(error) {
    return {
      status: 400,
      body: {
        error: error.message
      }
    }
  }

  static unauthorizedError() {
    return {
      status: 401,
      body: {
        error: new UnauthorizedError().message
      }
    }
  }

  static serverError() {
    return {
      status: 500,
      body: {
        error: new ServerError().message
      }
    }
  }
}