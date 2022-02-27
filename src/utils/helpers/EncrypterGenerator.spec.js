jest.mock('bcrypt', () => ({
  hashed_value: 'any-hash',

  async hash (value, salt) {
    this.value = value
    this.salt = salt
    return this.hashed_value
  }
}))

const MissingParamError = require('../errors/MissingParamError')
const EncrypterGenerator = require('./EncrypterGenerator')
const bcrypt = require('bcrypt')

const makeSut = () => {
  const sut = new EncrypterGenerator()
  return sut
}

describe('EncrypterGenerator', () => {
  it('should throw if no value is provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })

  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any-value')
    expect(bcrypt.value).toBe('any-value')
    expect(bcrypt.salt).toBe(8)
  })

  it('should return hash if valid params are provided', async () => {
    const sut = makeSut()
    const hash = await sut.generate('any-value')
    expect(hash).toBe('any-hash')
  })
})