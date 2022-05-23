const express = require('express');
const Client = require('../../models/client');
const { checkUserToken } = require('../../middlewares/authentication');
const router = express.Router();

router.get('/clients', [ checkUserToken ], async (req, res) => {
	const store = req.query.store_id;
	try {
		const clients = await Client.find(
			{
				active: true,
				store: store
			},
			'_id name email phone created_date signature'
		).exec();
		if (!clients) {
			return res.status(400).json({
				ok: false,
				err: 'Error getting clients',
				type: 6
			});
		} else {
			return res.status(200).json({
				ok: true,
				clients: clients,
				count: clients.length
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

router.get('/client/:id', [ checkUserToken ], async (req, res) => {
	const id = req.params.id;
	const is_admin = req.user.role === 'ADMIN_ROLE';
	try {
		const clientDB = await Client.findById(id);
		if (clientDB) {
			if (clientDB.store._id.toString() !== req.store._id && !is_admin) {
				return res.status(400).json({
					ok: false,
					err: 'You are not allowed to view this client',
					type: 7
				});
			} else {
				return res.status(200).json({
					ok: true,
					client: clientDB
				});
			}
		} else {
			return res.status(400).json({
				ok: false,
				message: 'Client not found',
				type: 4
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
