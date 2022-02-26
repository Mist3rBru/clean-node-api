const MissingParamError = require('../errors/MissingParamError')

class TokenGenerator {
	async generate(payload) {
		if (!payload) {
			throw new MissingParamError('payload')
		}
		return
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
