const { MissingParamError } = require('../errors') 

const { compare } = require('bcrypt')

class Encrypter {
  async compare(value, hashedValue) { 
    if(!value) { 
      throw new MissingParamError('value')
    }
    if(!hashedValue) { 
      throw new MissingParamError('hashed-value')
    }
  }
}

const makeSut = () => { 
  const sut = new Encrypter()
  return sut
}

describe('Encrypter', () => {
  it('should throw if no value is provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value').message)
  })

  it('should throw if no hashed value is provided', async () => {
    const sut = makeSut()
    expect(sut.compare('any-value')).rejects.toThrow(new MissingParamError('hashed-value').message)
  })
})