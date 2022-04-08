const { MissingParamError, InvalidParamError } = require('../utils/errors')
const RegisterUseCase = require('./RegisterUserUseCase')

const body = { email: 'any-email', password: 'any-password' }

const makeSut = () => {
  const findUserByEmailRepositorySpy = makeFindUserByEmailRepository()
  const encrypterGeneratorSpy = makeEncrypterGenerator()
  const registerUserRepositorySpy = makeRegisterUserRepository()
  const sut = new RegisterUseCase({
    encrypterGenerator: encrypterGeneratorSpy,
    registerUserRepository: registerUserRepositorySpy,
    findUserByEmailRepository: findUserByEmailRepositorySpy
 })
  return {
    sut,
    encrypterGeneratorSpy,
    registerUserRepositorySpy,
    findUserByEmailRepositorySpy,
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

const makeEncrypterGeneratorWithError = () => {
  class EncrypterGeneratorSpy {
    async generate(password) { throw new Error() }
  }
  return new EncrypterGeneratorSpy
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

const makeRegisterUserRepositoryWithError = () => {
  class RegisterUserRepositorySpy {
    async register(data) { throw new Error() }
  }
  return new RegisterUserRepositorySpy()
}

const makeFindUserByEmailRepository = () => {
  class FindUserByEmailRepositorySpy {
    async find(email) {
      this.email = email
      return this.user
    }
  }
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  findUserByEmailRepositorySpy.user = null
  return findUserByEmailRepositorySpy
}

const makeFindUserByEmailRepositoryWithError = () => {
  class FindUserByEmailRepositorySpy {
    async find(email) { throw new Error() }
  }
  return new FindUserByEmailRepositorySpy()
}

describe('RegisterUseCase', () => {
  it('should throw if no body is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.register()
    expect(promise).rejects.toThrow(new MissingParamError('body'))
  })

  it('should call findUserByEmailRepository with correct values', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    await sut.register(body)
    expect(findUserByEmailRepositorySpy.email).toBe(body.email)
  })

  it('should throw id findUserByEmailRepository return a user', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.user = 'any-user'
    const promise =  sut.register(body)
    expect(promise).rejects.toThrow(new InvalidParamError('email was already taken'))
  })

  it('should call encrypterGenerator with correct values', async () => {
    const { sut, encrypterGeneratorSpy } = makeSut()
    await sut.register(body)
    expect(encrypterGeneratorSpy.password).toBe(body.password)
  })

  it('should call registerUserRepository with correct values', async () => {
    const { sut, registerUserRepositorySpy } = makeSut()
    await sut.register(body)
    expect(registerUserRepositorySpy.data).toEqual({ email: 'any-email', password_hash: 'any-hash'}) 
  })

  it('should return user if valid params are provided', async () => {
    const { sut } = makeSut()
    const user = await sut.register(body)
    expect(user).toBe('any-user')
  })

  it('should throw if any dependency is not provided', async () => {
    const encrypterGenerator = makeEncrypterGenerator()
    const registerUserRepository = makeRegisterUserRepository()
    const invalid = {}
    const suts = [].concat(
      new RegisterUseCase(),
      new RegisterUseCase({}),
      new RegisterUseCase({
        encrypterGenerator: invalid,
      }),
      new RegisterUseCase({
        encrypterGenerator,
        registerUserRepository: invalid
      }),
      new RegisterUseCase({
        encrypterGenerator,
        registerUserRepository,
        findUserByEmailRepository: invalid
      }),
    )
    for(let sut of suts) {
      const promise = sut.register(body)
      expect(promise).rejects.toThrow()
    }
  })

  it('should throw if any dependency is not provided', async () => {
    const encrypterGenerator = makeEncrypterGenerator()
    const registerUserRepository = makeRegisterUserRepository()
    const suts = [].concat(
      new RegisterUseCase({
        encrypterGenerator: makeEncrypterGeneratorWithError(),
      }),
      new RegisterUseCase({
        encrypterGenerator,
        registerUserRepository: makeRegisterUserRepositoryWithError()
      }),
      new RegisterUseCase({
        encrypterGenerator,
        registerUserRepository,
        findUserByEmailRepository: makeFindUserByEmailRepositoryWithError()
      }),
    )
    for(let sut of suts) {
      const promise = sut.register(body)
      expect(promise).rejects.toThrow()
    }
  })
})