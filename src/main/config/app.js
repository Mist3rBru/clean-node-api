const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/content-type')

const express = require('express')
const path = require('path')
const fg = require('fast-glob')

class App {
	constructor() {
		this.express = express()
		this.router = express.Router()
		this._middlewares()
		this._routes()
	}

	_middlewares() {
		this.express.disable('x-powered-by')
		this.express.use(cors)
		this.express.use(jsonParser)
		this.express.use(contentType)
	}

	_routes() {
		this.express.use('/api', this.router)
		const dir = path.resolve(__dirname, '../../../') + '/'
		fg.sync('**/src/main/routes/**routes.js').forEach((file) =>
			require(dir + file)(this.router)
		)
	}
}

const app = new App()

module.exports = app.express
