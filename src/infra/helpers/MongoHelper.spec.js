jest.mock('mongoose', () => ({
	db: 'any-db',

	async createConnection(uri) {
		this.uri = uri
		return this.db
	},

	async disconnect() {
		return null
	}
}))

const sut = require('./MongoHelper')
const mongoose = require('mongoose')

describe('MongoHelper', () => {
	it('should call mongoose createConnection with correct values', async () => {
		await sut.connect('any-uri')
		expect(mongoose.uri).toBe('any-uri')
	})

	it('should return database when valid uri is provided', async () => {
		const db = await sut.connect('any-uri')
		expect(db).toBe('any-db')
	})

	it('should set database to null on disconnect', async () => {
		await sut.disconnect()
		expect(sut.db).toBeNull()
	})
})
