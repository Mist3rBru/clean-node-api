const LoginRouter = require('./LoginRouter')
const {
	MissingParamError,
	InvalidParamError,
	UnauthorizedError,
	ServerError,
} = require('../../utils/errors')

const makeSut = () => {
	const emailValidatorSpy = makeEmailValidator()
	const authUseCaseSpy = makeAuthUseCase()
	const sut = new LoginRouter({
		emailValidator: emailValidatorSpy,
		authUseCase: authUseCaseSpy,
	})
	return {
		sut,
		emailValidatorSpy,
		authUseCaseSpy,
	}
}

const makeEmailValidator = () => {
	class EmailValidatorSpy {
		isValid(email) {
			this.email = email
			return this.isEmailValid
		}
	}
	const emailValidatorSpy = new EmailValidatorSpy()
	emailValidatorSpy.isEmailValid = true
	return emailValidatorSpy
}

const makeAuthUseCase = () => {
	class AuthUseCaseSpy {
		async auth(email, password) {
			this.email = email
			this.password = password
			return this.accessToken
		}
	}
	const authUseCaseSpy = new AuthUseCaseSpy()
	authUseCaseSpy.accessToken = 'any-token'
	return authUseCaseSpy
}

const makeEmailValidatorWithError = () => {
	class EmailValidatorSpy {
		isValid() {
			throw new Error()
		}
	}
	return new EmailValidatorSpy()
}

const makeAuthUseCaseWithError = () => {
	class AuthUseCaseSpy {
		auth() {
			throw new Error()
		}
	}
	return new AuthUseCaseSpy()
}

describe('Login Router', () => {
	it('should return 400 when email is not provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: null,
			},
		}
		const HttpResponse = await sut.route(httpRequest)
		expect(HttpResponse.status).toBe(400)
		expect(HttpResponse.body.error).toBe(new MissingParamError('email').message)
	})

	it('should return 400 when a invalid email is provided', async () => {
		const { sut, emailValidatorSpy } = makeSut()
		emailValidatorSpy.isEmailValid = false
		const httpRequest = {
			body: {
				email: 'invalid-email',
			},
		}
		const HttpResponse = await sut.route(httpRequest)
		expect(HttpResponse.status).toBe(400)
		expect(HttpResponse.body.error).toBe(new InvalidParamError('email').message)
	})

	it('should return 400 when password is not provided', async () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any-email',
				password: null,
			},
		}
		const HttpResponse = await sut.route(httpRequest)
		expect(HttpResponse.status).toBe(400)
		expect(HttpResponse.body.error).toBe(
			new MissingParamError('password').message
		)
	})

	it('should return 400 when a invalid password is provided', async () => {
		const { sut, authUseCaseSpy } = makeSut()
		authUseCaseSpy.accessToken = null
		const httpRequest = {
			body: {
				email: 'any-email',
				password: 'invalid-password',
			},
		}
		const HttpResponse = await sut.route(httpRequest)
		expect(HttpResponse.status).toBe(401)
		expect(HttpResponse.body.error).toBe(new UnauthorizedError().message)
	})

	it('should return a token when valid credencials are provided', async () => {
		const { sut, authUseCaseSpy } = makeSut()
		const httpRequest = {
			body: {
				email: 'any-email',
				password: 'any-password',
			},
		}
		const HttpResponse = await sut.route(httpRequest)
		expect(HttpResponse.status).toBe(200)
		expect(HttpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
	})

	test('should throw if any dependency was not provided', async () => {
		const emailValidator = makeEmailValidator()
		const suts = [].concat(
			new LoginRouter(), 
			new LoginRouter({}),
			new LoginRouter({ emailValidator })
		)

		for (const sut of suts) {
			const httpRequest = {
				body: {
					email: 'any_email',
					password: 'any_password',
				},
			}
			const httpResponse = await sut.route(httpRequest)
			expect(httpResponse.status).toBe(500)
			expect(httpResponse.body.error).toBe(new ServerError().message)
		}
	})

	test('should throw if any dependency throws', async () => {
		const authUseCase = makeAuthUseCase()
		const suts = [].concat(
			new LoginRouter({
				authUseCase: makeAuthUseCaseWithError(),
			}),
			new LoginRouter({
				authUseCase,
				emailValidator: makeEmailValidatorWithError(),
			})
		)
		for (const sut of suts) {
			const httpRequest = {
				body: {
					email: 'any_email',
					password: 'any_password',
				},
			}
			const httpResponse = await sut.route(httpRequest)
			expect(httpResponse.status).toBe(500)
			expect(httpResponse.body.error).toBe(new ServerError().message)
		}
	})

	it('should return 500 if no httpRequest is provided', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.route()
		expect(httpResponse.status).toBe(500)
		expect(httpResponse.body.error).toBe(new ServerError().message)
	})
})
