const MissingParamError = require('../utils/errors/MissingParamError')
const app = require('./config/app')
const env = require('./config/env')
const host = env.APP_HOST
const port = env.APP_PORT || 3000

app.listen(port, (error) => {
  if(error) throw new Error(error.message)
	if (!port) throw new MissingParamError('port')
  console.log(`server is running on ${host}:${port}`)
})
