const { MissingParamError } = require('../utils/errors')

module.exports = class RegisterUseCase {
  constructor({ encrypterGenerator, registerUserRepository } = {}) {
    this.encrypterGenerator = encrypterGenerator
    this.registerUserRepository = registerUserRepository
  }

  async register (body) {
    if(!body) {
      throw new MissingParamError('body')
    }
    const { password, ...data } = body
    if(!password) {
      throw new MissingParamError('password')
    }
    const hash = await this.encrypterGenerator.generate(password)
    data.password_hash = hash
    const user = await this.registerUserRepository.register(data)
    return user
  }
}