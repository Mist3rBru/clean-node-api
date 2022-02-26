const mongoose = require('mongoose')
const { parsed: env } = require('dotenv').config()

class MongoHelper {
  constructor(uri) { 
    this.uri = uri
  }
  async connect() {
    mongoose.Promise = global.Promise
    await mongoose.connect(this.uri)
      .then(() => {
        console.log('Mongo is connected')
      })
      .catch((error) => {
        throw new Error(error.message)
      })
    return true
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