const { MissingParamError } = require('../../utils/errors')

class LoginRouter {
  async route(httpRequest) {

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

    expect(httpResponse.status).toBe(400)
  })

  it('should return 400 when password is not provided', async() => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any-email',
      },
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.status).toBe(400)
  })
})