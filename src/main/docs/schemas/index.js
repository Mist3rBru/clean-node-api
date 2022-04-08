const { loginParamsSchema, signupParamsSchema } = require('./params')
const { userSchema } = require('./users')
const { errorSchema } = require('./errors')

module.exports = {
  loginParams:  loginParamsSchema,
  signupParams: signupParamsSchema,
  user: userSchema,
  error: errorSchema
}