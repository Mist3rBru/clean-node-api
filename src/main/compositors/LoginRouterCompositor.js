const TokenGenerator = require('../../utils/helpers/TokenGenerator')
const Encrypter = require('../../utils/helpers/Encrypter')
const FindUserByEmailRepository = require('../../infra/repositories/FindUserByEmailRepository')
const AuthUseCase = require('../../domain/AuthUseCase')

module.exports = class LoginRouterCompositor {
	static async compose() {
		const tokenGenerator = new TokenGenerator()
		const encrypter = new Encrypter()
		const findUserByEmailRepository = new FindUserByEmailRepository()
		const authUseCase = new AuthUseCase({
			findUserByEmailRepository,
			encrypter,
			tokenGenerator,
		})

		const EmailValidator = require('../../utils/helpers/EmailValidator')
		const LoginRouter = require('../../presentation/routers/LoginRouter')

		const emailValidator = new EmailValidator()
		return new LoginRouter({
			emailValidator,
			authUseCase,
		})
	}
}
