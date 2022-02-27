jest.mock('bcrypt', () => ({
  hash: 'any-hash',

  async hash (value) {
    this.value = value
    return this.hash
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
  })
})