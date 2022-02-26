const MissingParamError = require('../../utils/errors/MissingParamError')
const FindUserByEmailRepository = require('./FindUserByEmailRepository')

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
    async findOne(object) { 
      this.email = object.where.email
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

  it('should call model with correct values', async () => {
    const { sut, modelSpy } = makeSut()
    await sut.find('any-email')
    expect(modelSpy.email).toBe('any-email')
  })

  it('should return null when model return null', async () => {
    const { sut, modelSpy } = makeSut()
    modelSpy.user = null
    const user = await sut.find('invalid-email')
    expect(user).toBeNull()
  })

  it('should return user when model return user', async () => {
    const { sut } = makeSut()
    const user = await sut.find('valid-email')
    expect(user).toBe('any-user')
  })
})