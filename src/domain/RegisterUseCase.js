const { MissingParamError } = require('../utils/errors')

module.exports = class RegisterUseCase {
  constructor({ encrypterGenerator } = {}) {
    this.encrypterGenerator = encrypterGenerator
  }

  async register (body) {
    if(!body) {
      throw new MissingParamError('body')
    }
    const { password } = body
    this.encrypterGenerator.generate(password)
  }
}