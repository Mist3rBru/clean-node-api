const MongoHelper = require('../../infra/helpers/MongoHelper')
const request = require('supertest')
const app = require('../config/app')
const env = require('../config/env')
let model

describe('CRUD User Routes', () => {
  beforeAll( async() =>{
    await MongoHelper.connect(env.MONGO_URL)
    model = await MongoHelper.getCollection('users')
    await model.deleteMany()
  })

  afterAll( async() => {
    await model.deleteMany()
    await MongoHelper.disconnect()
  })

  it('should return 200 on create user', async () => {
    const user = { 
      name: 'any-name',
      email: 'any-email@example.com' ,
      password: 'any-password',
    }
    const res = await request(app).post('/api/user').send(user)
    const data = await model.findOne({ email: user.email })
    expect(res.status).toBe(200)
    expect(data.email).toBe(user.email)
    expect(data.password).toBeUndefined()
  })
})