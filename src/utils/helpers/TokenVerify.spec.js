jest.mock('jsonwebtoken', () => ({
  isValid: true,

  verify(token, secret, cb) { 
    this.token = token
    this.secret = secret
    cb(this.isValid)
  }
}))

const MissingParamError = require('../../utils/errors/MissingParamError')
const jwt = require('jsonwebtoken')

class TokenVerify {
  async verify(token, secret) {
    if(!token) {
      throw new MissingParamError('token')
    }
    if(!secret) {
      throw new MissingParamError('secret')
    }

  }
}

const makeSut = () => {
  const sut = new TokenVerify()
  return sut
}

describe('TokenVerify', () => {
  it('should throw if no token is provided', async () => {
    const sut = makeSut()
    const promise = sut.verify()
    expect(promise).rejects.toThrow(new MissingParamError('token'))
  })

  it('should throw if no secret is provided', async () => {
    const sut = makeSut()
    const promise = sut.verify('any-token')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })
})