const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor({ emailValidator, authUseCase } = {}) {
    this.emailValidator = emailValidator
    this.authUseCase = authUseCase
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
    const token = await this.authUseCase.auth(email, password)
    if(!token) {
      return HttpResponse.unauthorizedError()
    }
    return HttpResponse.ok({ token })
  }
}