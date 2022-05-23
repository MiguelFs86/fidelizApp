const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connection.on('connected', () => {
	addToLog('info', 'Connection established');
});

mongoose.connection.on('reconnected', () => {
	addToLog('warn', 'Database reconnected');
});

mongoose.connection.on('disconnected', () => {
	addToLog('warn', 'Database disconnected');
	setTimeout(() => {
		createConnection();
	}, 5000);
});

mongoose.connection.on('close', () => {
	addToLog('info', 'Connection closed');
});

mongoose.connection.on('error', (error) => {
	addToLog('error', 'Database ERROR');
});

createConnection = async () => {
	if (process.env.NODE_ENV === 'prod') {
		setTimeout(async () => {
			try {
				await mongoose.connect(process.env.MONGO_URI, {
					user: process.env.DB_USERNAME,
					pass: process.env.DB_PWD,
					useNewUrlParser: true
				});
			} catch (error) {
				addToLog('error', error);
			}
		}, 10000);
	} else {
		try {
			await mongoose.connect(process.env.MONGO_URI, {
				useNewUrlParser: true
			});
		} catch (error) {
			addToLog('error', error);
		}
	}
};

module.exports = {
	createConnection
};
