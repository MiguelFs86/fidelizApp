const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkAdminRole, checkDistributorRole } = require('../../middlewares/authentication');
const Store = require('../../models/store');
const router = express.Router();

router.post('/register/store', [ checkUserToken, checkAdminRole, checkDistributorRole ], async (req, res) => {
	let body = req.body;
	let store;

	try {
		const storeDB = await Store.findOne({
			username: body.username
		});
		if (storeDB) {
			return res.status(400).json({
				ok: false,
				message: 'There already exists an store with this name',
				type: 9
			});
		} else {
			store = new Store({
				name: body.name,
				email: body.email,
				password: bcrypt.hashSync(body.password, 10),
				username: body.username,
				user: body.user,
				gpdr_text: body.gpdr_text,
				allowed_connections: 50000000
			});

			if (req.files) {
				const images = [
					{
						type: 'background_1',
						image: req.files.background_img_1
					},
					{
						type: 'background_2',
						image: req.files.background_img_2
					},
					{
						type: 'background_3',
						image: req.files.background_img_3
					},
					{
						type: 'background_4',
						image: req.files.background_img_4
					},
					{
						type: 'background_5',
						image: req.files.background_img_5
					},
					{
						type: 'logo',
						image: req.files.logo_image
					}
				];
				const updatedStore = await saveStoreImages(store, images);
				if (!updatedStore.ok) {
					return res.status(400).json({
						ok: false,
						message: updatedStore.error,
						type: 10
					});
				} else {
					store = updatedStore.storeDB;
				}
			}
			const savedStore = await store.save();
			if (savedStore) {
				addToLog('info', `Store "${store.name}" created by user "${req.user.username}"`);
				return res.status(200).json({
					ok: true,
					message: 'Store successfully created',
					store: savedStore,
					type: 1
				});
			} else {
				return res.status(400).json({
					ok: false,
					message: 'Failed on creating store',
					type: 10
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

saveStoreImages = async (storeDB, images) => {
	try {
		for (let i = 0; i < images.length; i++) {
			let file = images[i].image;
			if (file) {
				// Valid extensions
				let validExtensions = [ 'png', 'jpg', 'gif', 'jpeg' ];
				let shortedName = file.name.split('.');
				let extension = shortedName[shortedName.length - 1];

				if (validExtensions.indexOf(extension) < 0) {
					return { ok: false, error: 'Allowed extensions: ' + validExtensions.join(', ') };
				}

				// Change filename
				let filename = `${storeDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;

				let type = '';
				// Use the mv() method to place the file somewhere on your server
				if (images[i].type === `background_${i + 1}`) {
					storeDB.background_img[i] = filename;
					type = 'background';
				}
				if (images[i].type === 'logo') {
					storeDB.logo_img = filename;
					type = 'logo';
				}

				await file.mv(`uploads/store/${type}/${filename}`);
			}
		}
		return { ok: true, storeDB };
	} catch (err) {
		return { ok: false, error: 'Failed on moving file' };
	}
};

module.exports = router;
