const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class RegisterUseCase {
  constructor({ encrypterGenerator, registerUserRepository, findUserByEmailRepository } = {}) {
    this.encrypterGenerator = encrypterGenerator
    this.registerUserRepository = registerUserRepository
    this.findUserByEmailRepository = findUserByEmailRepository
  }

  async register (body) {
    if(!body) {
      throw new MissingParamError('body')
    }
    if(await this.findUserByEmailRepository.find(body.email)) {
      throw new InvalidParamError('email was already taken')
    }
    const { password, ...data } = body
    data.password_hash = await this.encrypterGenerator.generate(password)
    const user = await this.registerUserRepository.register(data)
    return user
  }
}