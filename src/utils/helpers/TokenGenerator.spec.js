jest.mock('jsonwebtoken', () => ({
	token: 'any-token',

	async sign(payload, secret, options) {
		this.payload = payload
		this.secret = secret
		this.options = options
		return this.token
	},
}))

const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

class TokenGenerator {
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

const makeSut = () => {
	return new TokenGenerator()
}

describe('TokenGenerator', () => {
	it('should throws if any param is not provided', () => {
		const sut = makeSut()
		expect(sut.generate()).rejects.toThrow(new MissingParamError('payload'))
		expect(sut.generate('any-payload')).rejects.toThrow(new MissingParamError('secret'))
	})

	it('should call jwt sign with correct values', async () => {
		const sut = makeSut()
		await sut.generate('any-payload', 'any-secret')
		expect(jwt.payload).toBe('any-payload')
		expect(jwt.secret).toBe('any-secret')
		expect(jwt.options).toEqual({ expiresIn: '15m' })
	})

	it('should return token if valid params are provided', async () => {
		const sut = makeSut()
		const token = await sut.generate('any-payload', 'any-secret')
		expect(token).toBe('any-token')
	})

	it('should return null if invalid params are provided', async () => {
		const sut = makeSut()
		jwt.token = null
		const token = await sut.generate('invalid-payload', 'invalid-secret')
		expect(token).toBeNull()
	})
})
