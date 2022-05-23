// ======================
// Backend URL
// ======================

process.env.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost';

// ======================
// Ports
// ======================

process.env.PORT = process.env.PORT || 3000;

process.env.SOCKET_PORT = process.env.SOCKET_PORT || 3000;

process.env.SSL_PORT = process.env.SSL_PORT || 8080;

// ======================
// Environment
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Token expiracy
// ======================
// 1000 milisegundos * 60 segundos * 60 minutos * 24 horas
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 1000;

// ======================
// Token SEED
// ======================
process.env.SEED = process.env.SEED || 'develop-seed';

// ======================
// Database
// ======================

process.env.DB_USERNAME = process.env.DB_USERNAME || 'fidelizApp1';
process.env.DB_PWD = process.env.DB_PWD || 'fidelizApp.1/1';
process.env.DB_NAME = process.env.DB_NAME || 'fidelizApp';
let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = `mongodb://localhost:27017/fidelizApp`;
	//
	process.env.MONGO_URI = urlDB;
}

// ======================
// Root config
// ======================
process.env.ROOT_PASSWORD = process.env.ROOT_PASSWORD || 'fidelizApp2022';

exports.GOOGLE_CONFIG = {
	installed: {
		client_id: '183642661476-3dbdvhcseoj21bc23e0d78td1adibd94.apps.googleusercontent.com',
		project_id: 'nice-unison-268212',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_secret: 'BlDFSBvddEGXwk-ohOdws9Lg',
		redirect_uris: [ 'urn:ietf:wg:oauth:2.0:oob' ]
	}
};

/**************************      ERROR CODES:      **************************/
/*
**** Register user ****
1.- Server error
2.- There already exists an user with this username
3.- Failed on creating user
4.- User not found

**** Update user ****
5.- There is no user with that ID

**** List users ****
6.- Error getting users
7.- You are not allowed to view this user

**** Delete users ****
8.- User couldnt be deleted


**** Register store ****
9.- There already exists an store with this name
10.- Failed on creating store
11.- Store not found

**** Update store ****
12.- There is no store with that ID

**** List stores ****
13.- Error getting stores
14.- You are not allowed to view this store

**** Delete store ****
15.- Store couldnt be deleted


**** Create client ****
16.- Client already exists
17.- Bad SQL statement
18.- Unable to connect with database server
19.- Client not found
20.- Error updating client


**** Login ****
21.- No user/password were provided
22.- Wrong username/password

**** Other errors ****
23.- Error saving client in MongoDB
24.- Wrong store type

*/
/**************************      ERROR CODES      **************************/
