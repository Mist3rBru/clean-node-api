jest.mock('mongoose', () => ({
	db: { async collection(){} },
	createConnection(uri) {
		this.uri = uri
		return this.db
	},

	async disconnect() { return null }
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
		expect(db).toHaveProperty('collection')
	})

	it('should set database to null on disconnect', async () => {
		await sut.disconnect()
		expect(sut.db).toBeFalsy()
	})

  it('should reconnect when getCollection() is invoked and database is disconnected', async () => {
		await sut.disconnect()
    await sut.getCollection('users')
    expect(sut.db).toBeTruthy()
  })
})
