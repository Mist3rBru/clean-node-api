const MissingParamError = require('../errors/MissingParamError')
const bcrypt = require('bcrypt')

module.exports = class EncrypterGenerator {
  async generate(value) {
    if(!value) { 
      throw new MissingParamError('value')
    }
    await bcrypt.hash(value, 8)
  }
}