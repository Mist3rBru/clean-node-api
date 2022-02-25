const env = require('../config/dotenv')
module.exports = {
	host: env.DB_HOST,
	port: env.DB_PORT,
	username: env.DB_USER,
	password: env.DB_PASS,
	database: env.DB_NAME,
	dialect: env.DB_DIALECT || 'postgres',
	storage: './__tests__/database.sqlite',
	logging: false,
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
	},
}
