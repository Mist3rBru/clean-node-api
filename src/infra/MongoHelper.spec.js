jest.mock('mongoose', () => ({
  db: 'any-db',
  
  async createConnection(uri) {
    this.uri = uri
    return this.db
  }
}))

const mongoose = require('mongoose')
const { parsed: env } = require('dotenv').config()

class MongoHelper {
  constructor(uri) { 
    this.uri = uri
  }

  async connect() {
    this.db =  mongoose.createConnection(this.uri)
    return this.db
  }
}

const makeSut = () => {
  const uri = env.MONGO_URL
  return new MongoHelper(uri)
}

describe('MongoHelper', () => {
  it('should return true if valid uri is provided', async () => {
    const sut = makeSut()
    const res = await sut.connect()
    expect(res).toBeTruthy()
  })
})