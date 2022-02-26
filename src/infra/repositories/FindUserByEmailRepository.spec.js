const MissingParamError = require('../../utils/errors/MissingParamError')

class FindUserByEmailRepository { 
  async find(email) { 
    if(!email) {
      throw new MissingParamError('email')
    }
  }
}

const makeSut = () => {
  const sut = new FindUserByEmailRepository()
  return { 
    sut
  }
}

describe('FindUserByEmailRepository', () => {
  it('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.find()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})