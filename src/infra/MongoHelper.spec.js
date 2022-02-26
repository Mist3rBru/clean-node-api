const mongoose = require('mongoose')
const { }

class MongoHelper {
  constructor({ url } = {}) { 
    this.url = url
  }
  connect() {
    mongoose.Promise = global.Promise
    mongoose.connect(url, { 
      useMongoClient: true,
    }).then(() => {
      console.log('Mongo is connected');
    }).catch((error) => {
      throw new Error(error.message)
    })
  } 
}

const makeSut = () => {
  return new MongoHelper()
}

describe('MongoHelper', () => {
  it('', () => {
    
  })
})