const mongoose = require('mongoose')

module.exports ={
  async connect(uri) { 
    this.uri = uri
    this.db =  mongoose.createConnection(this.uri)
    return this.db
  }
}
