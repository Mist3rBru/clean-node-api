jest.mock('bcrypt', () => ({
  isValid: true,

  async compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}))

const { MissingParamError } = require('../errors') 

const bcrypt = require('bcrypt')

class Encrypter {
  async compare(value, hash) { 
    if(!value) { 
      throw new MissingParamError('value')
    }
    if(!hash) { 
      throw new MissingParamError('hash')
    }
    return await bcrypt.compare(value, hash)
  }
}

const makeSut = () => { 
  return new Encrypter()
}

describe('Encrypter', () => {
  it('should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value').message)
    expect(sut.compare('any-value')).rejects.toThrow(new MissingParamError('hash').message)
  })

  it('should return the same provided params', async () => {
    const sut = makeSut()
    const value = 'any-value'
    const hash = 'any-hash'
    await sut.compare(value, hash)
    expect(bcrypt.value).toBe(value)
    expect(bcrypt.hash).toBe(hash)
  })
})