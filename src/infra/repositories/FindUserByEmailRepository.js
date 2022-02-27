const MissingParamError = require('../../utils/errors/MissingParamError')
const MongoHelper = require('../helpers/MongoHelper')
const env = require('../../main/config/env')

module.exports = class FindUserByEmailRepository { 
  async find(email) { 
    if(!email) {
      throw new MissingParamError('email')
    }
    await MongoHelper.connect(env.MONGO_URL)
    const model = await MongoHelper.getCollection('users')
    const user = model.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email']
    })
    return user
  }
}
