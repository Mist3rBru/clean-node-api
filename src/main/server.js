const MongoHelper = require('../infra/helpers/MongoHelper')
const app = require('./config/app')
const env = require('./config/env')
const port = env.APP_PORT

MongoHelper.connect(env.MONGO_URL)
  .then( console.log('MongoDB is connected'))

app.listen(port, () => {
	console.log(`Server is running on localhost:${port}`)
})
