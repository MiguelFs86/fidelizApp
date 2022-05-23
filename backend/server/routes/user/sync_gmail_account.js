const { GOOGLE_CONFIG } = require('../../config/config');
const express = require('express');
const User = require('../../models/user');
const Store = require('../../models/store');
const gmail = require('../../utils/gmail_sync');
const { checkUserToken, checkAdminRole, checkDistributorRole } = require('../../middlewares/authentication');
const router = express.Router();

/* This function takes the code returned by the authURL and stores the token */
router.post(
	'/user/:id/gmail_sync/authurl',
	[ checkUserToken, checkDistributorRole, checkAdminRole ],
	async (req, res) => {
		const body = req.body;
		const id = req.params.id;
		const user = await User.findById(id);
		gmail
			.getNewToken(GOOGLE_CONFIG, body.key)
			.then(async (token) => {
				await user.update({
					googleToken: token
				});
				return res.status(200).json({
					ok: true
				});
			})
			.catch((error) => {
				return res.status(200).json({
					ok: false,
					message: error
				});
			});
	}
);

/*

This function tries to get Google contacts, ERP contacts
and compare them to add contacts to Gmail
If user hasn't a Google token, the response is the AuthURL

*/
router.get('/user/:id/gmail_sync', [ checkUserToken, checkDistributorRole, checkAdminRole ], async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findById(id);
		const gmail_response = await gmail.init(GOOGLE_CONFIG, '', user.googleToken);
		if (gmail_response.ok) {
			const contactsUpdated = await compareContacts(gmail_response.response, erp_contacts.response);
				if (contactsUpdated && contactsUpdated.length > 0) {
					const insertedContacts = await insertContacts(user, contactsUpdated);
					if (insertedContacts.ok) {
						return res.status(200).json({
							count: insertedContacts.count,
							ok: true
						});
					} else {
						return res.status(200).json({
							message: insertedContacts.err,
							ok: false
						});
					}
				} else {
					return res.status(200).json({
						ok: false,
						error: 'No contacts to update'
					});
				}
		} else {
			/* This is returned when user has NO Google token */
			return res.status(200).json({
				message: gmail_response.response,
				ok: false
			});
		}
	} catch (err) {
		return res.status(200).json({
			message: 'Error updating gmail contacts',
			ok: false,
			err: err
		});
	}
});

module.exports = router;
