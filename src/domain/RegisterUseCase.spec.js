const { MissingParamError } = require('../utils/errors')
const RegisterUseCase = require('./RegisterUseCase')

const makeSut = () => {
  const encrypterGeneratorSpy = makeEncrypterGenerator()
  const registerUserRepositorySpy = makeRegisterUserRepository()
  const sut = new RegisterUseCase({
    encrypterGenerator: encrypterGeneratorSpy,
    registerUserRepository: registerUserRepositorySpy
 })
  return {
    sut,
    encrypterGeneratorSpy,
    registerUserRepositorySpy,
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

const makeRegisterUserRepository = () => {
  class RegisterUserRepositorySpy {
    async register(data) {
      this.data = data
      return this.user
    }
  }
  const registerUserRepositorySpy = new RegisterUserRepositorySpy()
  registerUserRepositorySpy.user = 'any-user'
  return registerUserRepositorySpy
}

describe('RegisterUseCase', () => {
  it('should throw if no body is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.register()
    expect(promise).rejects.toThrow(new MissingParamError('body'))
  })

  it('should throw if no password is provided on body', async () => {
    const { sut } = makeSut()
    const promise = sut.register({})
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call encrypterGenerator with correct values', async () => {
    const { sut, encrypterGeneratorSpy } = makeSut()
    await sut.register({ password: 'any-password'})
    expect(encrypterGeneratorSpy.password).toBe('any-password')
  })

  it('should call registerUserRepository with correct values', async () => {
    const { sut, registerUserRepositorySpy } = makeSut()
    await sut.register({ password: 'any-password'})
    expect(registerUserRepositorySpy.data).toEqual({ password_hash: 'any-hash'})
  })
})