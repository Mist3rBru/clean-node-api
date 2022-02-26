const MissingParamError = require('../utils/errors/MissingParamError')

module.exports = class AuthUseCase {
	constructor({ findByEmailRepo, encrypter } = {}) {
		this.findByEmailRepo = findByEmailRepo
		this.encrypter = encrypter
	}

	async auth(email, password) {
		if (!email) {
			throw new MissingParamError('email')
		}
		if (!password) {
			throw new MissingParamError('password')
		}
		const { password_hash } = await this.findByEmailRepo.find(email)
		const isValid = await this.encrypter.compare(password, password_hash)
		return
	}
}