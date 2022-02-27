const MongoHelper = require('../helpers/MongoHelper')
const MissingParamError = require('../../utils/errors/MissingParamError')

module.exports = class RegisterUserRepository {
  async register(data) {
    if(!data) {
      throw new MissingParamError('data')
    }
    if(!data.email){
      throw new MissingParamError('email')
    }
    const userModel = await MongoHelper.getCollection('users')
    await userModel.insertOne(data)
    const user = await userModel.findOne({ email: data.email })
    return user
  }
}