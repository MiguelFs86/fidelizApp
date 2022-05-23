const express = require('express');
const Session = require('../../models/session');
const { checkUserToken, checkAdminRole, checkDistributorRole } = require('../../middlewares/authentication');
const router = express.Router();

router.get('/store/:id/connections', [ checkUserToken, checkDistributorRole, checkAdminRole ], async (req, res) => {
	const store = req.params.id;
	try {
		const sessions = await Session.find({ store: store });
		if (sessions) {
			return res.status(200).json({
				ok: true,
				sessions: sessions
			});
		} else {
			return res.status(200).json({
				ok: true,
				sessions: []
			});
		}
	} catch (err) {
		return res.status(500).json({
			ok: false,
			err: err
		});
	}
});

module.exports = router;
