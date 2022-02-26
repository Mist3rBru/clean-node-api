const MissingParamError = require('../../utils/errors/MissingParamError')

module.exports = class FindUserByEmailRepository { 
  constructor(model) {
    this.model = model
  }

  async find(email) { 
    if(!email) {
      throw new MissingParamError('email')
    }
    const user = await this.model.findOne({ where: { email }})
    return user
  }
}
