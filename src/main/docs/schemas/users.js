const userSchema = {
  type: 'object',
  properties: {
    token: {
      type: 'string'
    }
  }
}

module.exports = { userSchema }