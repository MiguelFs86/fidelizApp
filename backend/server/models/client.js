const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	email: {
		type: String,
		required: [ true, 'Mail is required' ]
	},
	phone: {
		type: String,
		required: [ true, 'Phone is required' ]
	},
	cif: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	city: {
		type: String,
		required: false
	},
	province: {
		type: String,
		required: false
	},
	zip_code: {
		type: String,
		required: false
	},
	signature: {
		type: String,
		required: false
	},
	invoice_detail: {
		type: Object,
		required: false
	},
	store: {
		type: Schema.Types.ObjectId,
		ref: 'Store',
		required: [ true, 'Store is required' ]
	},
	active: {
		type: Boolean,
		default: true
	},
	created_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Client', clientSchema);
