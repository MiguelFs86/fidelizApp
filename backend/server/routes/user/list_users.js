const express = require('express');
const User = require('../../models/user');
const {
	checkUserToken,
	checkAdminRole,
	checkDistributorRole,
	checkUserRole
} = require('../../middlewares/authentication');
const router = express.Router();

router.get('/users', [ checkUserToken, checkDistributorRole, checkAdminRole ], async (req, res) => {
	try {
		const user_role = req.user.role;
		let users;
		if (user_role === 'ADMIN_ROLE') {
			users = await User.find(
				{
					active: true,
					role: [ 'USER_ROLE', 'DISTRIBUTOR_ROLE' ]
				},
				'_id name email username role created_date logo_img'
			).exec();
		}
		if (user_role === 'DISTRIBUTOR_ROLE') {
			const id = req.params.id;
			const user = User.findById(id);
			users = await User.find(
				{
					active: true,
					role: 'USER_ROLE',
					distributor: user
				},
				'_id name email username created_date logo_img'
			).exec();
		}
		if (!users) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting users',
				type: 6
			});
		} else {
			return res.status(200).json({
				ok: true,
				users: users
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

router.get('/user/:id', [ checkUserToken, checkUserRole ], async (req, res) => {
	const id = req.params.id;
	const is_admin = req.user.role === 'ADMIN_ROLE';
	const is_distributor = req.user.role === 'DISTRIBUTOR_ROLE';
	try {
		const userDB = await User.findById(id);
		if (userDB) {
			if (userDB.distributor) {
				if (userDB.distributor._id !== req.user._id && !is_admin) {
					return res.status(400).json({
						ok: false,
						err: 'You are not allowed to view this user',
						type: 7
					});
				}
			}
			if (userDB._id.toString() !== req.user._id && !is_admin && !is_distributor) {
				return res.status(400).json({
					ok: false,
					err: 'You are not allowed to view this user',
					type: 7
				});
			} else {
				return res.status(200).json({
					ok: true,
					user: userDB
				});
			}
		} else {
			return res.status(400).json({
				ok: false,
				message: 'User not found',
				type: 4
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			ok: false,
			err: err,
			type: 1
		});
	}
});

router.get('/users/distributors', [ checkUserToken, checkAdminRole ], async (req, res) => {
	try {
		const user_role = req.user.role;
		let users;
		if (user_role === 'ADMIN_ROLE') {
			users = await User.find(
				{
					active: true,
					role: 'DISTRIBUTOR_ROLE'
				},
				'_id name email username created_date logo_img'
			).exec();
		}
		if (!users) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting users',
				type: 6
			});
		} else {
			return res.status(200).json({
				ok: true,
				users: users
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
