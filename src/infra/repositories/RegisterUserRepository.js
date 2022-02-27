const MissingParamError = require('../../utils/errors/MissingParamError')

module.exports = class RegisterUserRepository {
  async register(data) {
    if(!data) {
      throw new MissingParamError('data')
    }
  }
}