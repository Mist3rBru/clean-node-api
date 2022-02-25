const LoginRouter = require('./LoginRouter')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter({
    emailValidator: emailValidatorSpy
  })
  return {
    sut,
    emailValidatorSpy
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


describe('Login', () => {
  it('should return 400 when email is not provided', async() => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: null,
        },
      }

      const HttpResponse = await sut.route(httpRequest)

      expect(HttpResponse.statusCode).toBe(400)
      expect(HttpResponse.body.error).toBe(new MissingParamError('email').message)
    }),

    it('should return 400 when a invalid email is provided', async() => {
      const { sut, emailValidatorSpy } = makeSut()
      emailValidatorSpy.isEmailValid = false
      const httpRequest = {
        body: {
          email: 'invalid-email',
        },
      }

      const HttpResponse = await sut.route(httpRequest)

      expect(HttpResponse.statusCode).toBe(400)
      expect(HttpResponse.body.error).toBe(new InvalidParamError('email').message)
    }),

    it('should return 400 when password is not provided', async() => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any-email',
          password: null
        },
      }

      const HttpResponse = await sut.route(httpRequest)

      expect(HttpResponse.statusCode).toBe(400)
      expect(HttpResponse.body.error).toBe(new MissingParamError('password').message)
    })
})