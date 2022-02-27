const MissingParamError = require('../../utils/errors/MissingParamError')
const MongoHelper = require('../helpers/MongoHelper')

module.exports = class FindUserByEmailRepository { 
  async find(email) { 
    if(!email) {
      throw new MissingParamError('email')
    }
    const userModel = await MongoHelper.getCollection('users')
    const user = userModel.findOne({ email })
    return user
  }
}
