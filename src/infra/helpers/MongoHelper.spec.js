jest.mock('mongoose', () => ({
	db: { 
		async collection(name){ 
			return name
		} 
	},

	createConnection(uri) {
		this.uri = uri
		return this.db
	},

	async disconnect() { return null }
}))

const sut = require('./MongoHelper')
const mongoose = require('mongoose')
const MissingParamError = require('../../utils/errors/MissingParamError')

describe('MongoHelper', () => {
	it('should throw if no uri is provided', async () => {
		const promise =  sut.connect()
		expect(promise).rejects.toThrow(new MissingParamError('uri'))
	})

	it('should call mongoose createConnection with correct values', async () => {
		await sut.connect('any-uri')
		expect(mongoose.uri).toBe('any-uri')
	})

	it('should set database to mongo client when connect', async () => {
		await sut.connect('any-uri')
		expect(sut.db).toBeTruthy()
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

  it('should throw if no collection name is provided', async () => {
    const promise = sut.getCollection()
    expect(promise).rejects.toThrow(new MissingParamError('name'))
  })

  it('should return collection form database', async () => {
    const collection = await sut.getCollection('any-collection')
    expect(collection).toBe('any-collection')
  })
})
