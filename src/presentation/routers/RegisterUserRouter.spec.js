const {
	MissingParamError,
	InvalidParamError,
	ServerError,
} = require('../../utils/errors')
const RegisterUserRouter = require('./RegisterUserRouter')

const makeHttpRequest = (body) => {
	return {
		body,
	}
}

const makeSut = () => {
	const registerUserUseCaseSpy = makeRegisterUserUseCase()
	const emailValidatorSpy = makeEmailValidator()
	const sut = new RegisterUserRouter({
		emailValidator: emailValidatorSpy,
		registerUserUseCase: registerUserUseCaseSpy,
	})
	return {
		sut,
		emailValidatorSpy,
		registerUserUseCaseSpy,
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

const makeRegisterUserUseCase = () => {
	class RegisterUserUseCaseSpy {
		async register(body) {
			this.body = body
			return this.user
		}
	}
	const registerUserUseCaseSpy = new RegisterUserUseCaseSpy()
	registerUserUseCaseSpy.user = 'any-user'
	return registerUserUseCaseSpy
}

const makeRegisterUseCaseWithError = () => {
	class RegisterUseCaseSpy {
		register(body) {
			throw new Error()
		}
	}
	return new RegisterUseCaseSpy()
}

describe('RegisterUserRouter', () => {
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
		expect(HttpResponse.body.error).toBe(new MissingParamError('password').message)
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

	it('should call registerUserUseCase with correct values', async () => {
		const { sut, registerUserUseCaseSpy } = makeSut()
		const HttpRequest = makeHttpRequest({
			name: 'any_name',
			email: 'any-email',
			password: 'any_password',
		})
		await sut.route(HttpRequest)
		expect(registerUserUseCaseSpy.body).toEqual(HttpRequest.body)
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

	it('should return 500 if any dependency is not provided', async () => {
    const emailValidator = makeEmailValidator()
    const invalid = {}
    const suts = [].concat(
      new RegisterUserRouter(),
      new RegisterUserRouter({}),
      new RegisterUserRouter({ 
        emailValidator: invalid, 
      }),
      new RegisterUserRouter({ 
        emailValidator, 
        registerUserUseCase: invalid,
      }),
    )
    for(let sut of suts) {
      const HttpRequest = makeHttpRequest({
        name: 'any_name',
        email: 'any-email',
        password: 'any_password',
      })
      const HttpResponse = await sut.route(HttpRequest)
      expect(HttpResponse.body.error).toBe(new ServerError().message)
      expect(HttpResponse.status).toBe(500)
    }
  })

	it('should return 500 if any dependency throws', async () => {
    const emailValidator = makeEmailValidator()
    const suts = [].concat(
      new RegisterUserRouter({ 
        emailValidator: makeEmailValidatorWithError(), 
      }),
      new RegisterUserRouter({ 
        emailValidator, 
        registerUserUseCase: makeRegisterUseCaseWithError(),
      }),
    )
    for(let sut of suts) {
      const HttpRequest = makeHttpRequest({
        name: 'any_name',
        email: 'any-email',
        password: 'any_password',
      })
      const HttpResponse = await sut.route(HttpRequest)
      expect(HttpResponse.body.error).toBe(new ServerError().message)
      expect(HttpResponse.status).toBe(500)
    }
  })

  it('should return 500 if no HttpRequest is provided', async () => {
    const { sut } = makeSut()
    const HttpResponse = await sut.route()
    expect(HttpResponse.body.error).toBe(new ServerError().message)
    expect(HttpResponse.status).toBe(500)
  })
})
