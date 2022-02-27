const MongoHelper = require('../helpers/MongoHelper')
const FindUserByEmailRepository = require('./FindUserByEmailRepository')
const MissingParamError = require('../../utils/errors/MissingParamError')
const env = require('../../main/config/env')
let model

const makeSut = () => {
  return new FindUserByEmailRepository()
}

describe('FindUserByEmailRepository', () => {
  beforeAll( async() =>{
    await MongoHelper.connect(env.MONGO_URL)
    model = await MongoHelper.getCollection('users')
  })

  beforeEach( async() => { 
    await model.deleteMany()
  })

  afterAll( async() => {
    await MongoHelper.disconnect()
  })

  it('should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.find('any-email')
    expect(user).toBeNull()
  })

  it('should return user with no password_hash', async () => {
    const fakeUser = await model.insertOne({
      name: 'any-name',
      email: 'any-email',
      password_hash: 'any-hash',
    })
    const sut = makeSut()
    const user = await sut.find('any-email')
    expect(user).toEqual({
      _id: fakeUser.insertedId,
      name: 'any-name',
      email: 'any-email',
    })
  })

  it('should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.find()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})