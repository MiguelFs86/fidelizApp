require('../config/config');
const bcrypt = require('bcrypt');
const User = require('../models/user');

createAdminUser = async () => {
	try {
		const userDB = await User.findOne({
			username: 'fidelizapp'
		});
		if (userDB) {
			addToLog('warn', 'Admin user already exists');
		} else {
			let user = new User({
				name: 'fidelizapp',
				email: 'admin@fidelizapp.com',
				password: bcrypt.hashSync(process.env.ROOT_PASSWORD, 10),
				username: 'fidelizapp',
				role: 'ADMIN_ROLE'
			});

			const savedUser = await user.save();
			if (savedUser) {
				addToLog('info', 'Admin user created sucessfully');
			} else {
				addToLog('error', 'Error saving admin user');
			}
		}
	} catch (err) {
		addToLog('error', 'Error creating admin user');
	}
};

module.exports = { createAdminUser: createAdminUser() };
