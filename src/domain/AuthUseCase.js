const MissingParamError = require('../utils/errors/MissingParamError')

module.exports = class AuthUseCase {
	constructor({ findUserByEmailRepository, encrypter, tokenGenerator } = {}) {
		this.findUserByEmailRepository = findUserByEmailRepository
		this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
	}

	async auth(email, password) {
		if (!email) {
			throw new MissingParamError('email')
		}
		if (!password) {
			throw new MissingParamError('password')
		}
		const user = await this.findUserByEmailRepository.find(email)
		const isValid = user && await this.encrypter.validate(password, user.password_hash)
    if(isValid) { 
      const accessToken = await this.tokenGenerator.generate(user._id)
      return accessToken
    }
		return null
	}
}