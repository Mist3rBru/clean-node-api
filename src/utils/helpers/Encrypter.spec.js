const { MissingParamError } = require('../errors') 

class Encrypter {
  hash(value) { 
    if(!value) { 
      throw new MissingParamError('value')
    }
  }
}

const makeSut = () => { 
  const sut = new Encrypter()
  return sut
}
