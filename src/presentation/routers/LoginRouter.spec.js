const LoginRouter = require('./LoginRouter')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidator()
  const authUseCaseSpy = makeAuthUseCase()
  const sut = new LoginRouter({
    emailValidator: emailValidatorSpy,
    authUseCase: authUseCaseSpy
  })
  return {
    sut,
    emailValidatorSpy,
    authUseCaseSpy
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
      return this.token
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.token = 'any-token'
  return authUseCaseSpy
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
    }),
    
    it('should return 400 when a invalid password is provided', async() => {
      const { sut, authUseCaseSpy } = makeSut()
      authUseCaseSpy.token = null
      const httpRequest = {
        body: {
          email: 'any-email',
          password: 'invalid-password',
        }
      }
      const HttpResponse = await sut.route(httpRequest)
      expect(HttpResponse.statusCode).toBe(401)
      expect(HttpResponse.body.error).toBe('Unauthorized')
    }),
    
    it('should return 400 when a invalid password is provided', async() => {
      const { sut, authUseCaseSpy } = makeSut()
      authUseCaseSpy.token = null
      const httpRequest = {
        body: {
          email: 'any-email',
          password: 'invalid-password',
        }
      }
      const HttpResponse = await sut.route(httpRequest)
      expect(HttpResponse.statusCode).toBe(401)
      expect(HttpResponse.body.error).toBe('Unauthorized')
    }),
    
    it('should return a token when valid credencials are provided', async() => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any-email',
          password: 'any-password',
        }
      }
      const HttpResponse = await sut.route(httpRequest)
      console.log(HttpResponse)
      expect(HttpResponse.statusCode).toBe(200)
      expect(HttpResponse.body.token).toBe('any-token')
    })
})