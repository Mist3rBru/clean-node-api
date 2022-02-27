const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const RegisterRouter = require('./RegisterRouter')

const makeSut = () => {
	const emailValidatorSpy = makeEmailValidator()
	const sut = new RegisterRouter({
		emailValidator: emailValidatorSpy,
	})
	return {
		sut,
		emailValidatorSpy,
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

describe('RegisterRouter', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      body: {
        name: null
      }
    }
    const HttpResponse = await sut.route(HttpRequest)
    expect(HttpResponse.body.error).toBe(new MissingParamError('name').message)
    expect(HttpResponse.status).toBe(400)
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const HttpRequest = {
      body: {
        name: 'any-name',
        email: null
      }
    }
    const HttpResponse = await sut.route(HttpRequest)
    expect(HttpResponse.body.error).toBe(new MissingParamError('email').message)
    expect(HttpResponse.status).toBe(400)
  })
})