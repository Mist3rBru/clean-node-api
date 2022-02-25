jest.mock('bcrypt', () => ({
  isValid: true,

  async compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}))

const MissingParamError = require('../errors/MissingParamError') 
const Encrypter = require('./Encrypter')
const bcrypt = require('bcrypt')

const makeSut = () => { 
  return new Encrypter()
}

describe('Encrypter', () => {
  it('should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value').message)
    expect(sut.compare('any-value')).rejects.toThrow(new MissingParamError('hash').message)
  })

  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const value = 'any-value'
    const hash = 'any-hash'
    await sut.compare(value, hash)
    expect(bcrypt.value).toBe(value)
    expect(bcrypt.hash).toBe(hash)
  })

  it('should return true if the params are valid', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any-value', 'any-hash')
    expect(isValid).toBe(true)
  })

  it('should return false if any params is invalid', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('invalid-value', 'invalid-hash')
    expect(isValid).toBe(false)
  })
})