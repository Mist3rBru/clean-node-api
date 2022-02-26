const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

module.exports = class TokenValidator {
  async validate(token, secret) {
    if(!token) {
      throw new MissingParamError('token')
    }
    if(!secret) {
      throw new MissingParamError('secret')
    }
    let isValid
    jwt.verify(token, secret, (error) => {
      isValid =  error ? false : true
    })
    return isValid
  }
}