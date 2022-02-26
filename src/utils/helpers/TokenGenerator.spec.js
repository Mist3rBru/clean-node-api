jest.mock('jsonwebtoken', () => ({
	token: 'any-token',

	async sign(payload) {
		this.payload = payload
		return this.token
	},
}))

const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

jwt.sign()
class TokenGenerator {
	async generate(payload) {
		if (!payload) {
			throw new MissingParamError('payload')
		}
	}
}

const makeSut = () => {
	const sut = new TokenGenerator()
	return sut
}

describe('TokenGenerator', () => {
	it('should throws if no payload is provided', () => {
		const sut = makeSut()
		const promise = sut.generate()
		expect(promise).rejects.toThrow(new MissingParamError('payload'))
	})
})
