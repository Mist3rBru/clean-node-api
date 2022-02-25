const MissingParamError = require('../utils/errors/MissingParamError')

class AuthUseCase { 
  constructor({ findByEmailRepo } = {}){
    this.findByEmailRepo = findByEmailRepo
  }

  async auth(email, password) {
    if(!email) { 
      throw new MissingParamError('email')
    }
    const user = await this.findByEmailRepo.find(email)
    if(!password) {
      throw new MissingParamError('password')
    }
    return
  }
}

const makeSut = () => {
  const findByEmailRepoSpy = makeFindByEmailRepo()
  const sut = new AuthUseCase({
    findByEmailRepo: findByEmailRepoSpy
  })
  return {
    sut, 
    findByEmailRepoSpy
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
  findByEmailRepoSpy.user = 'any-user'
  return findByEmailRepoSpy
}

describe('AuthUseCase', () => {
  it('should throw if any param is not provided', () => {
    const { sut } = makeSut()
    expect(sut.auth()).rejects.toThrow(new MissingParamError('email').message)
    expect(sut.auth('any-email')).rejects.toThrow(new MissingParamError('password').message)
  })

  it('should throw if any param is not provided', () => {
    const { sut } = makeSut()
    expect(sut.auth()).rejects.toThrow(new MissingParamError('email').message)
    expect(sut.auth('any-email')).rejects.toThrow(new MissingParamError('password').message)
  })

  it('should call findByEmailRepo with correct values', async () => {
    const { sut, findByEmailRepoSpy } = makeSut()
    await sut.auth('any-email', 'any-password')
    expect(findByEmailRepoSpy.email).toBe('any-email')
  })
})