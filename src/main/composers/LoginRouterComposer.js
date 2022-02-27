const TokenGenerator = require('../../utils/helpers/TokenGenerator')
const Encrypter = require('../../utils/helpers/Encrypter')
const FindUserByEmailRepository = require('../../infra/repositories/FindUserByEmailRepository')
const AuthUseCase = require('../../domain/AuthUseCase')
const EmailValidator = require('../../utils/helpers/EmailValidator')
const LoginRouter = require('../../presentation/routers/LoginRouter')
const env = require('../config/env')

module.exports = class LoginRouterCompositor {
	static compose() {
		const tokenGenerator = new TokenGenerator(env.TOKEN_SECRET)
		const encrypter = new Encrypter()
		const findUserByEmailRepository = new FindUserByEmailRepository()
		const authUseCase = new AuthUseCase({
			findUserByEmailRepository,
			encrypter,
			tokenGenerator,
		})


		const emailValidator = new EmailValidator()
		return new LoginRouter({
			emailValidator,
			authUseCase,
		})
	}
}
