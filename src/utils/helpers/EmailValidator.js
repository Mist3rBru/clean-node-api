const { MissingParamError } = require('../errors')

module.exports = class EmailValidator {
  isValid(email) {
    if(!email) {
      throw new MissingParamError('email')
    }
  }
}