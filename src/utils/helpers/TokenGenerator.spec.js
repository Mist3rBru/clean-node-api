jest.mock('jsonwebtoken', () => ({
	token: 'any-token',

	async sign(payload, secret, options) {
		this.payload = payload
		this.secret = secret
		this.options = options
		return this.token
	},
}))

const TokenGenerator = require('./TokenGenerator')
const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

const makeSut = () => {
	return new TokenGenerator('any-secret')
}

describe('TokenGenerator', () => {
	it('should throws if any param is not provided', () => {
		const sut = new TokenGenerator()
		expect(sut.generate()).rejects.toThrow(new MissingParamError('payload'))
		expect(sut.generate('any-payload')).rejects.toThrow(new MissingParamError('secret'))
	})

	it('should call jwt sign with correct values', async () => {
		const sut = makeSut()
		await sut.generate('any-payload')
		expect(jwt.payload).toEqual({ id: 'any-payload'})
		expect(jwt.secret).toBe('any-secret')
	})

	it('should return token if valid params are provided', async () => {
		const sut = makeSut()
		const token = await sut.generate('any-payload')
		expect(token).toBe('any-token')
	})

	it('should return null if invalid params are provided', async () => {
		const sut = makeSut()
		jwt.token = null
		const token = await sut.generate('invalid-payload', 'invalid-secret')
		expect(token).toBeNull()
	})
})
