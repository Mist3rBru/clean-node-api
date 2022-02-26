jest.mock('jsonwebtoken', () => ({
  isValid: true,

  verify(token, secret, cb) { 
    this.token = token
    this.secret = secret
    cb(this.isValid)
  }
}))

const jwt = require('jsonwebtoken')

class TokenVerify {
  async verify(token) {

  }
}

describe('TokenVerify', () => {
  it('', () => {
    
  })
})