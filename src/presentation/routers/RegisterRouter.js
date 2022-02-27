const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class RegisterRouter {
  constructor({ emailValidator } = {}) {
    this.emailValidator = emailValidator
  }
  
  async route(httpRequest) {
    try {
      const { name, email, password } = httpRequest.body
      if(!name) {
        return HttpResponse.badRequest(new MissingParamError('name'))
      }
      if(!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if(!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      } 
      if(!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
    } catch(error) {
      return HttpResponse.serverError()
    }
  }
}
