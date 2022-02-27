const MongoHelper = require('../../infra/helpers/MongoHelper')
const request = require('supertest')
const app = require('../config/app')
const env = require('../config/env')

const { hashSync } = require('bcrypt')
const hashedPassword = hashSync('any-password', 8)
const user = {
  name: 'any-name',
  email: 'any-email@example.com',
  password: 'any-password',
  password_hash: hashedPassword,
}
let model

describe('Login Routes', () => {
  beforeAll( async() =>{
    await MongoHelper.connect(env.MONGO_URL)
    model = await MongoHelper.getCollection('users')
    await model.insertOne(user)
  })

  afterAll( async() => {
    await model.deleteMany()
    await MongoHelper.disconnect()
  })

  it('should return 200 if valid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send(user)
      .expect(200)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const invalidCredentials = { 
      email: 'invalid-email@example.com',
      password: 'invalid-password'
    }
    await request(app)
      .post('/api/login')
      .send(invalidCredentials)
      .expect(401)
  })
})