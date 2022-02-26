const MissingParamError = require('../utils/errors/MissingParamError')
const AuthUseCase = require('./AuthUseCase')

const makeSut = () => {
	const findByEmailRepoSpy = makeFindByEmailRepo()
	const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
	const sut = new AuthUseCase({
		findByEmailRepo: findByEmailRepoSpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
	})
	return {
		sut,
		findByEmailRepoSpy,
    encrypterSpy,
    tokenGeneratorSpy
	}
}

const makeFindByEmailRepo = () => {
	class FindByEmailRepoSpy {
		async find(email) {
			this.email = email
			return this.user
		}
	}
	const findByEmailRepoSpy = new FindByEmailRepoSpy()
	findByEmailRepoSpy.user = { 
    password_hash: 'any-hash',
    id: 'any-id',
  }
	return findByEmailRepoSpy
}

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(value, hash) {
      this.value = value
      this.hash = hash
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(id) { 
      this.id = id
      return this.token
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.token = 'any-token'
  return tokenGeneratorSpy
}

describe('AuthUseCase', () => {
	it('should throw if any param is not provided', () => {
		const { sut } = makeSut()
		expect(sut.auth()).rejects.toThrow(new MissingParamError('email').message)
		expect(sut.auth('any-email')).rejects.toThrow(
			new MissingParamError('password').message
		)
	})

	it('should call findByEmailRepo with correct values', async () => {
		const { sut, findByEmailRepoSpy } = makeSut()
		await sut.auth('any-email', 'any-password')
		expect(findByEmailRepoSpy.email).toBe('any-email')
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
		expect(tokenGeneratorSpy.id).toBe('any-id')
	})

	it('should call token generator with correct values', async () => {
		const { sut, tokenGeneratorSpy } = makeSut()
		await sut.auth('any-email', 'any-password')
		expect(tokenGeneratorSpy.id).toBe('any-id')
	})

	it('should return access token when valid params are provided', async () => {
		const { sut } = makeSut()
		const accessToken = await sut.auth('any-email', 'any-password')
		expect(accessToken).toBe('any-token')
	})

	it('should return null when invalid email is provided', async () => {
		const { sut, findByEmailRepoSpy } = makeSut()
    findByEmailRepoSpy.user = null
		const accessToken = await sut.auth('invalid-email', 'any-password')
		expect(accessToken).toBeNull()
	})
})
