const MissingParamError = require('../../utils/errors/MissingParamError')
const RegisterUserRepository = require('./RegisterUserRepository')
const MongoHelper = require('../helpers/MongoHelper')
const env = require('../../main/config/env')
let model 

const makeSut = () => {
  const sut = new RegisterUserRepository
  return sut
}

describe('RegisterUserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
    model = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await model.deleteMany()
  })
  
  afterAll(async () => {
    await model.deleteMany()
    await MongoHelper.disconnect()
  })

  it('should throw if no data is provided', async () => {
    const sut = makeSut()
    const promise = sut.register()
    expect(promise).rejects.toThrow(new MissingParamError('data'))
  })

  it('should throw if no email is provided on data', async () => {
    const sut = makeSut()
    const promise = sut.register({})
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should return user when it is registered', async () => {
    const sut = makeSut()
    const user = await sut.register({email: 'any-email'})
    expect(user.email).toBe('any-email')
  })
})