const MissingParamError = require('../errors/MissingParamError') 
const bcrypt = require('bcrypt')

module.exports = class Encrypter {
  async validate(value, hash) { 
    if(!value) { 
      throw new MissingParamError('value')
    }
    if(!hash) { 
      throw new MissingParamError('hash')
    }
    return await bcrypt.compare(value, hash)
  }
}