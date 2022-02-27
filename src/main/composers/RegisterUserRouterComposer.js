const RegisterUserRepository = require('../../infra/repositories/RegisterUserRepository')
const EncrypterGenerator = require('../../utils/helpers/EncrypterGenerator')
const RegisterUserUseCase = require('../../domain/RegisterUserUseCase')
const EmailValidator = require('../../utils/helpers/EmailValidator')
const RegisterUserRouter = require('../../presentation/routers/RegisterUserRouter')

module.exports = class RegisterUserComposer {
  static compose() {
    const registerUserRepository = new RegisterUserRepository()
    const encrypterGenerator = new EncrypterGenerator()
    const registerUserUseCase = new RegisterUserUseCase({
      encrypterGenerator,
      registerUserRepository,
    })
    const emailValidator = new EmailValidator()
    
    return new RegisterUserRouter({ 
      emailValidator,
      registerUserUseCase,
    })
  }
}