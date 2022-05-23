const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
let {
	checkUserToken,
	checkAdminRole,
	checkUserRole,
	checkDistributorRole
} = require('../../middlewares/authentication');
const Store = require('../../models/store');
const router = express.Router();

router.put('/update/store/:id', [ checkUserToken, checkUserRole ], async (req, res) => {
	let body = req.body;
	let id = req.params.id;
	try {
		let storeDB = await Store.findById(id);
		if (!storeDB) {
			return res.status(400).json({
				ok: false,
				message: 'There is no store with that ID',
				type: 12
			});
		} else {
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
						image: req.files.logo_image || ''
					}
				];
				const response = await updateStoreImages(storeDB, images);
				if (!response.ok) {
					return res.status(400).json({
						ok: false,
						message: response.error,
						type: 1
					});
				} else {
					storeDB = response.storeDB;
				}
			}
			let updatedStore;
			if (!body.password) {
				updatedStore = await Store.findByIdAndUpdate(storeDB._id, {
					id: body._id,
					name: body.name,
					email: body.email,
					username: body.username,
					user: body.user,
					background_img: storeDB.background_img,
					logo_img: storeDB.logo_img,
					gpdr_text: body.gpdr_text,
					allowed_connections: body.allowed_connections
				});
			} else {
				updatedStore = await Store.findByIdAndUpdate(storeDB._id, {
					id: body._id,
					name: body.name,
					email: body.email,
					password: bcrypt.hashSync(body.password, 10),
					username: body.username,
					user: body.user,
					background_img: storeDB.background_img,
					logo_img: storeDB.logo_img,
					gpdr_text: body.gpdr_text,
					allowed_connections: body.allowed_connections
				});
			}
			if (updatedStore) {
				addToLog('info', `Store "${updatedStore.name}" updated by user "${req.user.username}"`);
				return res.status(200).json({
					ok: true,
					message: 'User updated successfully',
					store: storeDB,
					type: 1
				});
			} else {
				return res.status(400).json({
					ok: false,
					message: 'Error updating store',
					type: 1
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

updateStoreImages = async (storeDB, images) => {
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

				const oldFilenames = [ storeDB.background_img[i], storeDB.logo_img ];

				let type = '';
				if (images[i].type === `background_${i + 1}`) {
					if (storeDB.background_img[i]) {
						deleteStoreFiles('background', oldFilenames[0]);
					}
					storeDB.background_img[i] = filename;
					type = 'background';
				}
				if (images[i].type === 'logo') {
					if (storeDB.logo_img) {
						deleteStoreFiles('logo', oldFilenames[1]);
					}
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

deleteStoreFiles = (type, filename) => {
	let imagePath = path.resolve(`uploads/store/${type}/${filename}`);
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = router;
