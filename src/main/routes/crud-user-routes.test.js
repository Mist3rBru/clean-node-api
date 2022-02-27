const MongoHelper = require('../../infra/helpers/MongoHelper')
const request = require('supertest')
const app = require('../config/app')
const env = require('../config/env')
let model

describe('CRUD User Routes', () => {
  beforeAll( async() =>{
    await MongoHelper.connect(env.MONGO_URL)
    model = await MongoHelper.getCollection('users')
  })

  afterAll( async() => {
    await model.deleteMany()
    await MongoHelper.disconnect()
  })

  it('', async () => {
    
  })
})