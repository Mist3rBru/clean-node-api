const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor({ emailValidator } = {}) {
    this.emailValidator = emailValidator
  }
  async route(httpRequest) {
    const { email, password } = httpRequest.body
    if(!email) {
      return HttpResponse.badRequest(new MissingParamError('email'))
    }
    if(!this.emailValidator.isValid(email)) {
      return HttpResponse.badRequest(new InvalidParamError('email'))
    }
    if(!password) {
      return HttpResponse.badRequest(new MissingParamError('password'))
    }
  }
}