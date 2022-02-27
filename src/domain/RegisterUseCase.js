const { MissingParamError } = require('../utils/errors')

module.exports = class RegisterUseCase {
  async register (body) {
    if(!body) {
      throw new MissingParamError('body')
    }
  }
}