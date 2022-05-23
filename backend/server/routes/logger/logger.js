const express = require('express');
const fs = require('fs');
const path = require('path');
const { checkUserToken, checkAdminRole, checkUserRole } = require('../../middlewares/authentication');
const router = express.Router();

router.post('/logger', [ checkUserToken, checkAdminRole ], async (req, res) => {
	const date = req.body.date;
	const year = date.split('-')[0];
	const month = date.split('-')[1];
	const day = date.split('-')[2].split('T')[0];
	const logFilename = year + '.' + month + '.' + day + '-dxestion.log';
	let log = [];

	try {
		if (fs.existsSync(path.resolve(__dirname, `../../../logs/${logFilename}`))) {
			var lineReader = require('readline').createInterface({
				input: require('fs').createReadStream(path.resolve(__dirname, `../../../logs/${logFilename}`))
			});

			lineReader.on('line', function(line) {
				log.push(line);
			});

			lineReader.on('close', function() {
				return res.status(200).json({
					ok: true,
					log: log
				});
			});
		} else {
			return res.status(200).json({
				ok: true,
				log: log
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
