const { MissingParamError } = require('../utils/errors')
const RegisterUseCase = require('./RegisterUseCase')

const makeSut = () => {
  const encrypterGeneratorSpy = makeEncrypterGenerator()
  const sut = new RegisterUseCase({
    encrypterGenerator: encrypterGeneratorSpy
 })
  return {
    sut,
    encrypterGeneratorSpy
  }
}

const makeEncrypterGenerator = () => {
  class EncrypterGeneratorSpy {
    async generate(password) {
      this.password = password
      return this.hash
    }
  }
  const encrypterGeneratorSpy = new EncrypterGeneratorSpy
  encrypterGeneratorSpy.hash = 'any-hash'
  return encrypterGeneratorSpy
}

describe('RegisterUseCase', () => {
  it('should throw if no body is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.register()
    expect(promise).rejects.toThrow(new MissingParamError('body'))
  })

  it('should call encrypterGenerator with correct values', async () => {
    const { sut, encrypterGeneratorSpy } = makeSut()
    await sut.register({ password: 'any-password'})
    expect(encrypterGeneratorSpy.password).toBe('any-password')
  })
})