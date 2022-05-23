const express = require('express');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const { checkUserToken, checkAdminRole } = require('../../middlewares/authentication');
const router = express.Router();

router.post('/change_admin_password', [ checkUserToken, checkAdminRole ], async (req, res) => {
	const id = req.body.id;
	try {
		if (req.user.role !== 'ADMIN_ROLE') {
			return res.status(200).json({
				ok: false,
				message: 'You are not allowed to do this operation'
			});
		}
		if (req.body.id && req.body.password) {
			const adminUser = await User.findById(id);
			if (!adminUser) {
				return res.status(400).json({
					ok: false,
					err: 'Error getting admin user'
				});
			} else {
				await adminUser.update({
					password: bcrypt.hashSync(req.body.password, 10)
				});
				return res.status(200).json({
					ok: true,
					message: 'Password updated successfully'
				});
			}
		} else {
			return res.status(200).json({
				ok: false,
				message: 'ID or new password is missing'
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

module.exports = router;
