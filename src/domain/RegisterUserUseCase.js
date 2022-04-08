const { MissingParamError, InvalidParamError } = require('../utils/errors')

module.exports = class RegisterUseCase {
  constructor({ encrypterGenerator, registerUserRepository, findUserByEmailRepository, tokenGenerator } = {}) {
    this.encrypterGenerator = encrypterGenerator
    this.registerUserRepository = registerUserRepository
    this.findUserByEmailRepository = findUserByEmailRepository
    this.tokenGenerator = tokenGenerator
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
    const accessToken = await this.tokenGenerator.generate(user._id)
    return accessToken
  }
}