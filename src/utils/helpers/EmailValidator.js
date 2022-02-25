const MissingParamError = require('../errors/MissingParamError')
const validator = require('validator')

module.exports = class EmailValidator {
  isValid(email) {
    if(!email) {
      throw new MissingParamError('email')
    }
    return validator.isEmail(email)
  }
}