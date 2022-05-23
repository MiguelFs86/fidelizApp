const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let sessionSchema = new Schema({
	store: {
		type: Schema.Types.ObjectId,
		ref: 'Store',
		required: [ true, 'Store is required' ]
	},
	session: {
		type: Object,
		required: [ true, 'Session is required' ]
	},
	sessionID: {
		type: String,
		required: true
	},
	created_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Session', sessionSchema);
