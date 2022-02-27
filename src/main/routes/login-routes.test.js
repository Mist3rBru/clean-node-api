const MongoHelper = require('../../infra/helpers/MongoHelper')
const { hashSync } = require('bcrypt')
const request = require('supertest')
const app = require('../config/app')
const env = require('../config/env')
let model

describe('Login Routes', () => {
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

  it('should return 200 if valid credentials are provided', async () => {
    const hash = hashSync('any-password', 8)
    const user = {
      name: 'any-name',
      email: 'any-email@example.com',
      password: 'any-password',
      password_hash: hash,
    }
    await model.insertOne(user)
    await request(app)
      .post('/api/login')
      .send(user)
      .expect(200)
  })
})