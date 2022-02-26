const { MissingParamError, InvalidParamError } = require('../utils/errors')

class AuthUseCase {
	constructor({ findByEmailRepo, encrypter } = {}) {
		this.findByEmailRepo = findByEmailRepo
		this.encrypter = encrypter
	}

	async auth(email, password) {
		if (!email) {
			throw new MissingParamError('email')
		}
		const { password_hash } = await this.findByEmailRepo.find(email)
		const isValid = await this.encrypter.compare(password, password_hash)
		if (!password) {
			throw new MissingParamError('password')
		}
		return
	}
}

const makeSut = () => {
	const findByEmailRepoSpy = makeFindByEmailRepo()
	const encrypterSpy = makeEncrypter()
	const sut = new AuthUseCase({
		findByEmailRepo: findByEmailRepoSpy,
    encrypter: encrypterSpy
	})
	return {
		sut,
		findByEmailRepoSpy,
    encrypterSpy
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
	findByEmailRepoSpy.user = { password_hash: 'any-hash' }
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
})
