const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class RegisterRouter {
  constructor({ emailValidator } = {}) {
    this.emailValidator = emailValidator
  }
  
  async route(httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if(!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if(!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
    } catch(error) {
      return HttpResponse.serverError()
    }
  }
}