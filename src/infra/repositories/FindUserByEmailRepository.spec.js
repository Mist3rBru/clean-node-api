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
})