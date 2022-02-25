const MissingParamError = require('../utils/errors/MissingParamError')

class AuthUseCase { 
  constructor({findByEmailRepo} = {}){
    this.findByEmailRepo = findByEmailRepo
  }

  async auth(email, password) {
    if(!email) { 
      throw new MissingParamError('email')
    }
    if(!password) {
      throw new MissingParamError('password')
    }
  }
}

const makeSut = () => {
  const findByEmailRepoSpy = makeFindByEmailRepo()
  const sut = new AuthUseCase()
  return {
    sut, 
    findByEmailRepoSpy
  }
}

const makeFindByEmailRepo = () => { 
  class FindByEmailRepoSpy { 
    find(email) { 
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
})