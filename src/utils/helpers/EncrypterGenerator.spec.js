const MissingParamError = require('../errors/MissingParamError')
const EncrypterGenerator = require('./EncrypterGenerator')

const makeSut = () => {
  const sut = new EncrypterGenerator()
  return sut
}

describe('EncrypterGenerator', () => {
  it('should throw if no payload is provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('payload'))
  })
})