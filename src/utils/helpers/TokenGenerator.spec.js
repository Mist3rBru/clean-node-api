jest.mock('jsonwebtoken', () => ({
	token: 'any-token',

	async sign(payload, secret, options) {
		this.payload = payload
		this.secret = secret
		this.options = options
		return this.token
	},
}))

const { parsed: env } = require('dotenv').config()

const MissingParamError = require('../errors/MissingParamError')
const jwt = require('jsonwebtoken')

class TokenGenerator {
	async generate(payload) {
		if (!payload) {
			throw new MissingParamError('payload')
		}
		return jwt.sign(payload, env.TOKEN_SECRET, { expiresIn: '15m' })
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

	it('should call jwt sign with correct values', async () => {
		const sut = makeSut()
		await sut.generate('any-payload')
		expect(jwt.payload).toBe('any-payload')
		expect(jwt.secret).toBe(env.TOKEN_SECRET)
		expect(jwt.options).toEqual({ expiresIn: '15m' })
	})

	it('should return token if valid payload is provided', async () => {
		const sut = makeSut()
		const token = await sut.generate('any-payload')
		expect(token).toBe('any-token')
	})
})
