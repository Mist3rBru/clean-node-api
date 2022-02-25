const MissingParamError = require('../utils/errors/MissingParamError')

class AuthUseCaseSpy { 
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
  return new AuthUseCaseSpy
}

describe('AuthUseCase', () => {
  it('should throw if any param is not provided', () => {
    const sut = makeSut()
    expect(sut.auth()).rejects.toThrow(new MissingParamError('email').message)
    expect(sut.auth('any-email')).rejects.toThrow(new MissingParamError('password').message)
  })
})