const {
	MissingParamError,
	InvalidParamError,
	ServerError,
} = require('../../utils/errors')
const RegisterRouter = require('./RegisterRouter')

const makeHttpRequest = (body) => {
	return {
		body,
	}
}

const makeSut = () => {
	const registerUseCaseSpy = makeRegisterUseCase()
	const emailValidatorSpy = makeEmailValidator()
	const sut = new RegisterRouter({
		emailValidator: emailValidatorSpy,
		registerUseCase: registerUseCaseSpy,
	})
	return {
		sut,
		emailValidatorSpy,
		registerUseCaseSpy,
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

const makeEmailValidatorWithError = () => {
	class EmailValidatorSpy {
		isValid() {
			throw new Error()
		}
	}
	return new EmailValidatorSpy()
}

const makeRegisterUseCase = () => {
	class RegisterUseCaseSpy {
		register(body) {
			this.body = body
			return this.user
		}
	}
	const registerUseCaseSpy = new RegisterUseCaseSpy()
	registerUseCaseSpy.user = 'any-user'
	return registerUseCaseSpy
}

const makeRegisterUseCaseWithError = () => {
	class RegisterUseCaseSpy {
		register(body) {
			throw new Error()
		}
	}
	return new RegisterUseCaseSpy()
}

describe('RegisterRouter', () => {
	it('should return 400 if no name is provided', async () => {
		const { sut } = makeSut()
		const HttpRequest = makeHttpRequest({})
		const HttpResponse = await sut.route(HttpRequest)
		expect(HttpResponse.body.error).toBe(new MissingParamError('name').message)
		expect(HttpResponse.status).toBe(400)
	})

	it('should return 400 if no email is provided', async () => {
		const { sut } = makeSut()
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
		})
		const HttpResponse = await sut.route(HttpRequest)
		expect(HttpResponse.body.error).toBe(new MissingParamError('email').message)
		expect(HttpResponse.status).toBe(400)
	})

	it('should return 400 if invalid email is provided', async () => {
		const { sut, emailValidatorSpy } = makeSut()
		emailValidatorSpy.isEmailValid = false
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
			email: 'invalid_email',
		})
		const HttpResponse = await sut.route(HttpRequest)
		expect(HttpResponse.body.error).toBe(new InvalidParamError('email').message)
		expect(HttpResponse.status).toBe(400)
	})

	it('should return 400 if no password is provided', async () => {
		const { sut } = makeSut()
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
			email: 'any-email',
		})
		const HttpResponse = await sut.route(HttpRequest)
		expect(HttpResponse.body.error).toBe(
			new MissingParamError('password').message
		)
		expect(HttpResponse.status).toBe(400)
	})

	it('should call emailValidator with correct values', async () => {
		const { sut, emailValidatorSpy } = makeSut()
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
			email: 'any-email',
			password: 'any_password',
		})
		await sut.route(HttpRequest)
		expect(emailValidatorSpy.email).toBe('any-email')
	})

	it('should call registerUseCase with correct values', async () => {
		const { sut, registerUseCaseSpy } = makeSut()
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
			email: 'any-email',
			password: 'any_password',
		})
		await sut.route(HttpRequest)
		expect(registerUseCaseSpy.body).toEqual(HttpRequest.body)
	})

	it('should return 200  when user is registered', async () => {
		const { sut } = makeSut()
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
			email: 'any-email',
			password: 'any_password',
		})
		const HttpResponse = await sut.route(HttpRequest)
		expect(HttpResponse.body).toBe('any-user')
	})
})
