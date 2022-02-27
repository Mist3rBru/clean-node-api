const MissingParamError = require('../../utils/errors/MissingParamError')
const FindUserByEmailRepository = require('./FindUserByEmailRepository')

const makeSut = () => {
  const sut = new FindUserByEmailRepository()
  return sut
}

describe('FindUserByEmailRepository', () => {
  it('', async () => {
    expect(null).toBe(null)
  })
})