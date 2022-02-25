const { MissingParamError } = require('../errors') 

class Encrypter {
  async compare(value, hashedValue) { 
    if(!value) { 
      throw new MissingParamError('value')
    }
  }
}

const makeSut = () => { 
  const sut = new Encrypter()
  return sut
}

describe('Encrypter', () => {
  it('should throw if no password is provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'))
  })
})