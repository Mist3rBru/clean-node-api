const MongoHelper = require('../../infra/helpers/MongoHelper')
const request = require('supertest')
const app = require('../config/app')
const env = require('../config/env')

const { hashSync } = require('bcrypt')
const user = {
  name: 'valid-name',
  email: 'valid-email@example.com',
  password: 'valid-password',
  password_hash: hashSync('valid-password', 8),
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
    await request(app)
      .post('/api/login')
      .send({
        email: 'invalid-email@example.com',
        password: 'valid-password'
      })
      .expect(401)

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid-email@example.com',
        password: 'invalid-password'
      })
      .expect(401)

  })
})