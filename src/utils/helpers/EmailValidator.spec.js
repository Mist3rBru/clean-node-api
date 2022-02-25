const EmailValidator = require('./EmailValidator')
const { MissingParamError } = require('../errors')

const makeSut = () => {
	const sut = new EmailValidator()
	return sut
}

describe('Email Validator', () => {
	it('should throw if email is not provided', () => {
		const sut = makeSut()
		expect(() => {
			sut.isValid()
		}).toThrow(new MissingParamError('email'))
	})

	it('should return false if a invalid email is provided', () => {
		const sut = makeSut()
		const email = 'invalid-email'
		const emailIsValid = sut.isValid(email)
		expect(emailIsValid).toBe(false)
	})

	it('should return true if a valid email is provided', () => {
		const sut = makeSut()
    const email = 'valid-email@example.com'
    const emailIsValid = sut.isValid(email)
    expect(emailIsValid).toBe(true)
	})
})
