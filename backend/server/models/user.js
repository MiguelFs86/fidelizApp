const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
	values: [ 'ADMIN_ROLE', 'DISTRIBUTOR_ROLE', 'USER_ROLE' ],
	message: '{VALUE} is not a valid role'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	username: {
		type: String,
		unique: true,
		required: [ true, 'Name is required' ]
	},
	email: {
		type: String,
		required: [ true, 'Mail is required' ]
	},
	password: {
		type: String,
		required: [ true, 'Password is required' ]
	},
	logo_img: {
		type: String,
		required: false
	},
	email_img: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	facebook: {
		type: String,
		required: false
	},
	twitter: {
		type: String,
		required: false
	},
	instagram: {
		type: String,
		required: false
	},
	youtube: {
		type: String,
		required: false
	},
	website: {
		type: String,
		required: false
	},
	role: {
		type: String,
		default: 'USER_ROLE',
		enum: validRoles
	},
	emailConfig: {
		type: Object,
		required: false
	},
	googleSync: {
		type: Boolean,
		require: false
	},
	googleToken: {
		type: Object,
		require: false
	},
	active: {
		type: Boolean,
		default: true
	},
	created_date: {
		type: Date,
		default: Date.now
	},
	distributor: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

userSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
};

userSchema.plugin(uniqueValidator, {
	message: '{PATH} must be unique'
});

module.exports = mongoose.model('User', userSchema);
