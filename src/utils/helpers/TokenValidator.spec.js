jest.mock('jsonwebtoken', () => ({
  error: false,

  verify(token, secret, cb) { 
    this.token = token
    this.secret = secret
    cb(this.error)
  }
}))

const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')
const TokenValidator = require('./TokenValidator')

const makeSut = () => {
  const sut = new TokenValidator()
  return sut
}

describe('TokenVerify', () => {
  it('should throw if no token is provided', async () => {
    const sut = makeSut()
    const promise = sut.validate()
    expect(promise).rejects.toThrow(new MissingParamError('token'))
  })

  it('should throw if no secret is provided', async () => {
    const sut = makeSut()
    const promise = sut.validate('any-token')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  it('should calls jwt with correct values', async () => {
    const sut = makeSut()
    await sut.validate('any-token', 'any-secret')
    expect(jwt.token).toBe('any-token')
    expect(jwt.secret).toBe('any-secret')
  })

  it('should return true if valid params are provided', async () => {
    const sut = makeSut()
    const isValid = await sut.validate('valid-token', 'valid-secret')
    expect(isValid).toBeTruthy()
  })

  it('should return false if invalid params are provided', async () => {
    const sut = makeSut()
    jwt.error = true
    const isValid = await sut.validate('invalid-token', 'invalid-secret')
    expect(isValid).toBeFalsy()
  })
})