const FindUserByEmailRepository = require('../../infra/repositories/FindUserByEmailRepository')
const RegisterUserRepository = require('../../infra/repositories/RegisterUserRepository')
const EncrypterGenerator = require('../../utils/helpers/EncrypterGenerator')
const RegisterUserUseCase = require('../../domain/RegisterUserUseCase')
const EmailValidator = require('../../utils/helpers/EmailValidator')
const TokenGenerator = require('../../utils/helpers/TokenGenerator')
const RegisterUserRouter = require('../../presentation/routers/RegisterUserRouter')
const env = require('../config/env')

module.exports = class RegisterUserComposer {
  static compose() {
    const tokenGenerator = new TokenGenerator(env.TOKEN_SECRET)
    const findUserByEmailRepository = new FindUserByEmailRepository()
    const registerUserRepository = new RegisterUserRepository()
    const encrypterGenerator = new EncrypterGenerator()
    const registerUserUseCase = new RegisterUserUseCase({
      encrypterGenerator,
      registerUserRepository,
      findUserByEmailRepository,
      tokenGenerator
    })
    const emailValidator = new EmailValidator()
    
    return new RegisterUserRouter({ 
      emailValidator,
      registerUserUseCase,
    })
  }
}