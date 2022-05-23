const { GOOGLE_CONFIG } = require('../config/config');
const User = require('../models/user');
const Store = require('../models/store');
const { google } = require('googleapis');
const sql = require('mssql');

const SCOPES = [ 'https://www.googleapis.com/auth/contacts' ];

// async function init(credentials, authCode, token) {
// 	return await authorize(credentials, authCode, token);
// }

async function init(credentials, authCode, token) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	if (!token) {
		return { ok: false, response: getNewToken(credentials, authCode) };
	}
	oAuth2Client.setCredentials(token);
	return { ok: true, response: await listContacts(oAuth2Client) };
}

function getNewToken(credentials, authCode) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	// console.log('Authorize this app by visiting this url:', authUrl);
	if (!authCode) {
		return authUrl;
	}

	return new Promise((resolve, reject) => {
		oAuth2Client.getToken(authCode, (err, token) => {
			if (err) {
				console.error('Error retrieving access token');
				reject(err);
			}
			resolve(token);
		});
	});
}

async function listContacts(auth) {
	try {
		const contacts = [];
		const service = google.people({ version: 'v1', auth });
		return new Promise((resolve, reject) => {
			service.people.connections.list(
				{
					personFields: [ 'names', 'emailAddresses', 'phoneNumbers' ],
					resourceName: 'people/me',
					pageSize: 2000
				},
				(err, res) => {
					if (err) {
						console.error('The API returned an error: ' + err);
						reject(err);
					}
					const connections = res.data.connections;
					if (connections) {
						connections.forEach((person) => {
							contacts.push({
								name: person.names ? person.names[0].displayName : '',
								phone_1: person.phoneNumbers ? person.phoneNumbers[0].value : '',
								phone_2: person.phoneNumbers[1] ? person.phoneNumbers[1].value : '',
								phone_3: person.phoneNumbers[2] ? person.phoneNumbers[2].value : '',
								email: person.emailAddresses ? person.emailAddresses[0].value : ''
							});
						});
					} else {
						console.log('No connections found.');
					}
					resolve(contacts);
				}
			);
		});
	} catch (error) {
		console.log('Error: ', error);
	}
}

async function syncAllContacts() {
	/* Retrieve all users and sync contacts */
	query = User.find({
		active: true,
		googleToken: { $exists: true }
	});
	query.select('_id name googleToken');
	const userList = await query.exec();
	for (let user of userList) {
		addToLog('info', `Start Gmail sync for user: "${user.name}"`);
		await insertContacts(user, newContacts);
		addToLog('info', `End Gmail sync for user: "${user.name}"`);
	}
}

insertContacts = async (user, contacts) => {
	if (contacts.length === 0) {
		addToLog('info', `No contacts inserted for user: "${user.name}"`);
		return { ok: true, count: 0 };
	}

	try {
		const { client_secret, client_id, redirect_uris } = GOOGLE_CONFIG.installed;
		const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		auth.setCredentials(user.googleToken);
		let contactInsertedCount = 0;
		for (let contact of contacts) {
			let contactObject = {
				emailAddresses: [ { value: contact.email } ],
				names: [ { displayName: contact.name, givenName: contact.name } ],
				phoneNumbers: [
					{
						value: contact.phone_1,
						canonicalForm: `+34${contact.phone_1}`,
						type: 'mobile',
						formattedType: 'Mobile'
					}
				]
			};

			contactInsertedCount += 1;
			const service = google.people({ version: 'v1', auth });
			const { data: newContact } = await service.people.createContact({
				requestBody: contactObject
			});
		}
		addToLog('info', `Contacts inserted for user "${user.name}": ${contactInsertedCount}`);
		return { ok: true, count: contactInsertedCount };
	} catch (err) {
		addToLog('error', `Error creating contacts for user: "${user.name}": ${err}`);
		return { ok: false, err };
	}
};

module.exports = { init, getNewToken, syncAllContacts };
