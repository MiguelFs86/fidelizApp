const path = require('path');
const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
let { checkUserToken, checkUserRole } = require('../../middlewares/authentication');
const User = require('../../models/user');
const router = express.Router();

router.put('/update/user', [ checkUserToken, checkUserRole ], async (req, res) => {
	let body = req.body;
	const id = body._id;

	try {
		let userDB = await User.findById(id);
		if (!userDB) {
			return res.status(400).json({
				ok: false,
				message: 'User not found',
				type: 4
			});
		} else {
			if (req.files) {
				const images = [
					{ type: 'logo', image: req.files.logo_image || '' },
					{ type: 'email', image: req.files.email_image || '' }
				];
				const updatedUser = await updateUserImages(userDB, res, images);
				if (!updatedUser.ok) {
					return res.status(500).json({
						ok: false,
						message: 'Fail moving image files',
						type: 1
					});
				} else {
					userDB = updatedUser.userDB;
				}
			}
			if (body.password) {
				await userDB.update({
					username: body.username,
					name: body.name,
					email: body.email,
					password: bcrypt.hashSync(body.password, 10),
					logo_img: userDB.logo_img,
					email_img: userDB.email_img,
					role: body.role,
					youtube: body.youtube,
					instagram: body.instagram,
					website: body.website,
					twitter: body.twitter,
					facebook: body.facebook,
					address: body.address,
					emailConfig: JSON.parse(body.emailConfig)
				});
			} else {
				await userDB.update({
					username: body.username,
					name: body.name,
					email: body.email,
					logo_img: userDB.logo_img,
					email_img: userDB.email_img,
					role: body.role,
					youtube: body.youtube,
					instagram: body.instagram,
					twitter: body.twitter,
					website: body.website,
					facebook: body.facebook,
					address: body.address,
					googleSync: body.googleSync,
					emailConfig: JSON.parse(body.emailConfig)
				});
			}
			addToLog('info', `User "${userDB.username}" updated by user "${req.user.username}"`);
			return res.status(200).json({
				ok: true,
				message: 'User updated successfully',
				user: userDB,
				type: 1
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

updateUserImages = async (userDB, res, images) => {
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
				let filename = `${userDB._id}-${new Date().getMilliseconds() * Math.random()}.${extension}`;

				if (images[i].type === 'logo') {
					if (userDB.logo_img) {
						deleteUserFiles(images[i].type, userDB.logo_img);
					}
					await file.mv(`uploads/user/${filename}`);
					userDB.logo_img = filename;
				}
				if (images[i].type === 'email') {
					if (userDB.email_img) {
						deleteUserFiles(images[i].type, userDB.email_img);
					}
					await file.mv(`uploads/user/${images[i].type}/${filename}`);
					userDB.email_img = filename;
				}
			}
		}
		return { ok: true, userDB };
	} catch (err) {
		return { ok: false, error: 'Failed on moving file' };
	}
};

deleteUserFiles = (type, filename) => {
	let imagePath = '';
	if (type === 'logo') {
		imagePath = path.resolve(`uploads/user/${filename}`);
	}
	if (type === 'email') {
		imagePath = path.resolve(`uploads/user/email/${filename}`);
	}
	if (fs.existsSync(imagePath)) {
		fs.unlinkSync(imagePath);
	}
};

module.exports = router;
