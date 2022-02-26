jest.mock('mongoose', () => ({
  db: 'any-db',
  
  async createConnection(uri) {
    this.uri = uri
    return this.db
  }
}))

const MongoHelper = require('./MongoHelper')
const mongoose = require('mongoose')
const { parsed: env } = require('dotenv').config()

const makeSut = () => {
  const uri = env.MONGO_URL
  return new MongoHelper(uri)
}

describe('MongoHelper', () => {
  it('should call mongoose createConnection with correct values', async () => {
    const sut  = new MongoHelper('any-uri')
    await sut.connect()
    expect(mongoose.uri).toBe('any-uri')
  })
})