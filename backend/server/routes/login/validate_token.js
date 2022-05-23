const express = require('express');
let { checkUserToken } = require('../../middlewares/authentication');
const User = require('../../models/user');
const Store = require('../../models/store');
const router = express.Router();

router.get('/login/validate_token', checkUserToken, async (req, res) => {
	return res.status(200).json({
		ok: true
	});
});

module.exports = router;
