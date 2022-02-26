const mongoose = require('mongoose')

module.exports = class MongoHelper {
  constructor(uri) { 
    this.uri = uri
  }

  async connect() {
    this.db =  mongoose.createConnection(this.uri)
    return this.db
  }
}
