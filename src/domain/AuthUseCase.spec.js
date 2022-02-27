const MissingParamError = require('../utils/errors/MissingParamError')
const AuthUseCase = require('./AuthUseCase')

const makeSut = () => {
	const findUserByEmailRepositorySpy = makeFindUserByEmailRepository()
	const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
	const sut = new AuthUseCase({
		findUserByEmailRepository: findUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
	})
	return {
		sut,
		findUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
	}
}

const makeFindUserByEmailRepository = () => {
	class FindUserByEmailRepositorySpy {
		async find(email) {
			this.email = email
			return this.user
		}
	}
	const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
	findUserByEmailRepositorySpy.user = { 
    _id: 'any-id',
    password_hash: 'any-hash',
  }
	return findUserByEmailRepositorySpy
}
const makeFindUserByEmailRepositoryWithError = () => {
	class FindUserByEmailRepositorySpy {
		async find() { throw new Error() }
	}
	return new FindUserByEmailRepositorySpy()
}

const makeEncrypter = () => {
  class EncrypterSpy {
    async validate(value, hash) {
      this.value = value
      this.hash = hash
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async validate() { throw new Error() }
  }
  return new EncrypterSpy()
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(payload) { 
      this.payload = payload
      return this.token
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.token = 'any-token'
  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() { throw new Error()}
  }
  return new TokenGeneratorSpy()
}

describe('AuthUseCase', () => {
	it('should throw if any param is not provided', () => {
		const { sut } = makeSut()
		expect(sut.auth()).rejects.toThrow(new MissingParamError('email').message)
		expect(sut.auth('any-email')).rejects.toThrow(
			new MissingParamError('password').message
		)
	})

	it('should call findUserByEmailRepository with correct values', async () => {
		const { sut, findUserByEmailRepositorySpy } = makeSut()
		await sut.auth('any-email', 'any-password')
		expect(findUserByEmailRepositorySpy.email).toBe('any-email')
	})

	it('should call encrypter with correct values', async () => {
		const { sut, encrypterSpy } = makeSut()
		await sut.auth('any-email', 'any-password')
		expect(encrypterSpy.value).toBe('any-password')
		expect(encrypterSpy.hash).toBe('any-hash')
	})

	it('should call token generator with correct values', async () => {
		const { sut, tokenGeneratorSpy } = makeSut()
		await sut.auth('any-email', 'any-password')
		expect(tokenGeneratorSpy.payload).toBe('any-id')
	})
  
	it('should return access token when valid params are provided', async () => {
		const { sut } = makeSut()
		const accessToken = await sut.auth('any-email', 'any-password')
		expect(accessToken).toBe('any-token')
	})

	it('should return null when invalid email is provided', async () => {
		const { sut, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.user = null
		const accessToken = await sut.auth('invalid-email', 'any-password')
		expect(accessToken).toBeNull()
	})

	it('should return null when invalid password is provided', async () => {
		const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
		const accessToken = await sut.auth('any-email', 'invalid-password')
		expect(accessToken).toBeNull()
	})

	it('should throw if any dependency is not provided', async () => {
    const invalid = {}
    const findUserByEmailRepository = makeFindUserByEmailRepository()
    const encrypter = makeEncrypter()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        findUserByEmailRepository: invalid
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter: invalid
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      }),
    )
    for(let sut of suts) {
      const promise = sut.auth('any-email', 'any-password')
      expect(promise).rejects.toThrow()
    } 
	})

	it('should throw if any dependency throws', async () => {
    const findUserByEmailRepository = makeFindUserByEmailRepository()
    const encrypter = makeEncrypter()
    const suts = [].concat(
      new AuthUseCase({
        findUserByEmailRepository: makeFindUserByEmailRepositoryWithError()
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      }),
    )
    for(let sut of suts) {
      const promise = sut.auth('any-email', 'any-password')
      expect(promise).rejects.toThrow()
    } 
	})
})
