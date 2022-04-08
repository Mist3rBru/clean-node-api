const loginPath = require('./login')
const signupPath = require('./signup')

module.exports = {
  '/user': signupPath,
  '/login': loginPath,
}
