const { MissingParamError } = require('../utils/errors')
const RegisterUseCase = require('./RegisterUseCase')

const makeSut = () => {
  const sut = new RegisterUseCase()
  return {
    sut,
  }
}

describe('RegisterUseCase', () => {
  it('should throw if no body is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.register()
    expect(promise).rejects.toThrow(new MissingParamError('body'))
  })
})