const TokenGenerator = require('../../utils/helpers/TokenGenerator')
const EncrypterValidator = require('../../utils/helpers/EncrypterValidator')
const FindUserByEmailRepository = require('../../infra/repositories/FindUserByEmailRepository')
const AuthUseCase = require('../../domain/AuthUseCase')
const EmailValidator = require('../../utils/helpers/EmailValidator')
const LoginRouter = require('../../presentation/routers/LoginRouter')
const env = require('../config/env')

module.exports = class LoginRouterCompositor {
	static compose() {
		const tokenGenerator = new TokenGenerator(env.TOKEN_SECRET)
		const encrypterValidator = new EncrypterValidator()
		const findUserByEmailRepository = new FindUserByEmailRepository()
		const authUseCase = new AuthUseCase({
			findUserByEmailRepository,
			encrypterValidator,
			tokenGenerator,
		})


		const emailValidator = new EmailValidator()
		return new LoginRouter({
			emailValidator,
			authUseCase,
		})
	}
}
