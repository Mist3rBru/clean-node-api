const { compare } = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define('Users', {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		password_hash: DataTypes.STRING,
		access: DataTypes.STRING,
	})

	Users.findById = async function (userId) {
		return await Users.findOne({ where: { id: userId } })
	}

	Users.findByEmail = async function (userEmail) {
		return await Users.findOne({
			attributes: ['id', 'name', 'email'],
			where: { email: userEmail },
		})
	}

	Users.comparePassword = async function (password, userId) {
		const { password_hash } = await Users.findById(userId)
		return await compare(password, password_hash)
	}

	return Users
}
