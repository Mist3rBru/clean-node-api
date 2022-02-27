const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class RegisterRouter {
	constructor({ emailValidator, registerUseCase } = {}) {
		this.emailValidator = emailValidator
		this.registerUseCase = registerUseCase
	}

	async route(HttpRequest) {
		try {
			const { name, email, password } = HttpRequest.body
			if (!name) {
				return HttpResponse.badRequest(new MissingParamError('name'))
			}
			if (!email) {
				return HttpResponse.badRequest(new MissingParamError('email'))
			}
			if (!this.emailValidator.isValid(email)) {
				return HttpResponse.badRequest(new InvalidParamError('email'))
			}
			if (!password) {
				return HttpResponse.badRequest(new MissingParamError('password'))
			}
			const user = await this.registerUseCase.register(HttpRequest.body)
			return HttpResponse.ok(user)
		} catch (error) {
			return HttpResponse.serverError()
		}
	}
}
