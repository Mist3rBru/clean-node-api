const MissingParamError = require('../errors/MissingParamError')

module.exports = class EncrypterGenerator {
  async generate(payload) {
    if(!payload) { 
      throw new MissingParamError('payload')
    }
  }
}