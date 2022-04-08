const badRequestComponent = require('./bad-request')
const serverErrorComponent = require('./server-error')
const unauthorizedErrorComponent = require('./unauthorized-error')

module.exports =  {
  badRequest: badRequestComponent,
  serverError: serverErrorComponent,
  unauthorizedError: unauthorizedErrorComponent
}
