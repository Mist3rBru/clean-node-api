jest.mock('mongoose', () => ({
	db: 'any-db',

	async createConnection(uri) {
		this.uri = uri
		return this.db
	},
}))

const MongoHelper = require('./MongoHelper')
const mongoose = require('mongoose')

const makeSut = () => {
	const sut = new MongoHelper('any-uri')
	return sut
}

describe('MongoHelper', () => {
	it('should call mongoose createConnection with correct values', async () => {
		const sut = new MongoHelper('any-uri')
		await sut.connect()
		expect(mongoose.uri).toBe('any-uri')
	})

	it('should return db when valid uri is provided', async () => {
		const sut = makeSut()
		const db = await sut.connect()
		expect(db).toBe('any-db')
	})
})
