const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

module.exports = class TokenGenerator {
	constructor(secret) {
		this.secret = secret
	}
	async generate(payload) {
		if (!payload) {
			throw new MissingParamError('payload')
		}
    if (!this.secret) { 
      throw new MissingParamError('secret')
    }
		return jwt.sign({ id: payload}, this.secret, { expiresIn: '15m' })
	}
}