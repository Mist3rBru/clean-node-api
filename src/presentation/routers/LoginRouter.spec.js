const HttpResponse = require('../helpers/HttpResponse')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class LoginRouter {
  async route(httpRequest) {
    const { email, password } = httpRequest.body
    if(!email) {
      return HttpResponse.badRequest(new MissingParamError(email))
    }
  }
}

describe('Login', () => {
  it('should return 400 when email is not provided', async() => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any-password',
      },
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})