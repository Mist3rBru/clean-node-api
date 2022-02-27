const app = require('./config/app')
const env = require('./config/env')
const port = env.APP_PORT

app.listen(port, () => {
	console.log(`Server is running on localhost:${port}`)
})
