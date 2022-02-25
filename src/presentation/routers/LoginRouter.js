const HttpResponse = require('../helpers/HttpResponse')

module.exports = class LoginRouter {
  async route(httpRequest) {
    const { email, password } = httpRequest.body
    if(!email) {
      return HttpResponse.badRequest(new MissingParamError(email))
    }
  }
}