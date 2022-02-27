const MissingParamError = require('../../utils/errors/MissingParamError')
const RegisterUserRepository = require('./RegisterUserRepository')

const makeSut = () => {
  const sut = new RegisterUserRepository
  return sut
}

describe('RegisterUserRepository', () => {
  it('should throw if no data is provided', async () => {
    const sut = makeSut()
    const promise = sut.register()
    expect(promise).rejects.toThrow(new MissingParamError('data'))
  })
})