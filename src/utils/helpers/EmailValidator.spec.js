const EmailValidator = require('./EmailValidator')
const { MissingParamError } = require('../errors')

const makeSut = () => {
  const sut = new EmailValidator()
  return sut
}

describe('Email Validator', () => {
  it('should throw if no email is provided', () => {
    const sut = makeSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})