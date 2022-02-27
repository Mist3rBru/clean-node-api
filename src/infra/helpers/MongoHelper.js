const MissingParamError = require('../../utils/errors/MissingParamError')
const mongoose = require('mongoose')

module.exports = {
  async connect(uri) { 
    if(!uri) {
      throw new MissingParamError('uri')
    }
    this.uri = uri
    this.db = mongoose.createConnection(this.uri)
    return this.db
  },

  async disconnect() {
    await mongoose.disconnect()
    this.db = null
  },

  async getCollection (name) {
    if (!this.db) {
      await this.connect(this.uri)
    }
    return await this.db.collection(name)
  }
}
