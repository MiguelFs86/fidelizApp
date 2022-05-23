const jwt = require('jsonwebtoken');

// =================
// Check for token
// =================
let checkUserToken = (req, res, next) => {
	let token = '';
	if (req.headers.authorization) {
		token = req.headers.authorization;
	} else {
		token = '';
	}

	if (token) {
		jwt.verify(token, process.env.SEED, (err, decoded) => {
			if (err) {
				return res.status(401).json({
					ok: false,
					err: {
						message: 'Invalid token',
						err: err,
						token: token,
						seed: process.env.SEED
					}
				});
			}

			req.user = decoded.user;
			req.store = decoded.store;
			next();
		});
	} else {
		return res.status(401).json({
			ok: false,
			message: 'Unauthorized'
		});
	}
};

// =================
// check admin role
// =================
let checkAdminRole = (req, res, next) => {
	let user = req.user;
	if (user.role && user.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.status(400).json({
			ok: false,
			message: 'User is not admin'
		});
	}
};

// =================
// check distributor role
// =================
let checkDistributorRole = (req, res, next) => {
	let user = req.user;

	if (user.role === 'DISTRIBUTOR_ROLE' || user.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.status(400).json({
			ok: false,
			message: 'User is not distributor'
		});
	}
};

// =================
// check user role
// =================
let checkUserRole = (req, res, next) => {
	let user = req.user;

	if (user.role === 'USER_ROLE' || user.role === 'ADMIN_ROLE' || user.role === 'DISTRIBUTOR_ROLE') {
		next();
	} else {
		return res.status(400).json({
			ok: false,
			message: 'User has no permissions to do this'
		});
	}
};

module.exports = {
	checkUserToken,
	checkAdminRole,
	checkDistributorRole,
	checkUserRole
};
