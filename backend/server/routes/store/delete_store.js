const express = require('express');
let { checkUserToken, checkAdminRole, checkDistributorRole } = require('../../middlewares/authentication');
const Store = require('../../models/store');
const router = express.Router();

router.delete('/update/store/:id', [ checkUserToken, checkDistributorRole, checkAdminRole ], async (req, res) => {
	let id = req.params.id;

	try {
		const storeDB = await Store.findById(id);
		if (storeDB) {
			storeDB.active = false;
			const deletedStore = await storeDB.save();
			if (deletedStore) {
				return res.status(200).json({
					ok: true,
					message: 'Store deleted'
				});
			} else {
				return res.status(400).json({
					ok: true,
					message: 'Store couldnt be deleted',
					type: 15
				});
			}
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
