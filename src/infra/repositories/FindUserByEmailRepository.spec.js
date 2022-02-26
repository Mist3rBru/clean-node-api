const MissingParamError = require('../../utils/errors/MissingParamError')

class FindUserByEmailRepository { 
  constructor(model) {
    this.model = model
  }

  async find(email) { 
    if(!email) {
      throw new MissingParamError('email')
    }
    await this.model.findOne({ email })
  }
}

const makeSut = () => {
  const modelSpy = makeModel()
  const sut = new FindUserByEmailRepository(modelSpy)
  return { 
    sut,
    modelSpy
  }
}

const makeModel = () => {
  class Model {
    async findOne({ email }) { 
      this.email = email
      return this.user 
    }
  }
  const model = new Model()
  model.user = 'any-user'
  return model
}

describe('FindUserByEmailRepository', () => {
  it('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.find()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})