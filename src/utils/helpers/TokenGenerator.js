const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

module.exports = class TokenGenerator {
	async generate(payload, secret) {
		if (!payload) {
			throw new MissingParamError('payload')
		}
    if (!secret) { 
      throw new MissingParamError('secret')
    }
		return jwt.sign(payload, secret, { expiresIn: '15m' })
	}
}