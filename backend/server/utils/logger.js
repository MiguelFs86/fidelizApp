const winston = require('winston');
const moment = require('moment');
const fs = require('fs');

let io;
let loggerObject = null;
let filename = '';

/* Log format */
const myFormat = winston.format.printf(({ level, message }) => {
	return `[${moment().format('DD-MM-YYYY HH:mm:ss')}] - ${level}: ${message}`;
});

logger = function() {
	return loggerObject;
};

addToLog = function(level, message) {
	const date = new Date();
	const newFilename =
		date.getFullYear() + '.' + formatDate(date.getMonth() + 1) + '.' + formatDate(date.getDate()) + '-dxestion.log';
	if (newFilename !== filename) {
		return new Promise((resolve, reject) => {
			loggerObject = winston.createLogger({
				format: winston.format.combine(myFormat),
				transports: [
					new winston.transports.Console(),
					new winston.transports.File({
						filename: `./logs/${newFilename}`
					})
				]
			});
			logger().log({
				level,
				message
			});
			resolve(true);
		});
	}
	logger().log({
		level,
		message
	});
	if (io) {
		io.emit('log message', `[${moment().format('DD-MM-YYYY HH:mm:ss')}] - ${level}: ${message}`);
	}
};

createLogger = function() {
	const date = new Date();
	filename =
		date.getFullYear() + '.' + formatDate(date.getMonth() + 1) + '.' + formatDate(date.getDate()) + '-dxestion.log';
	return new Promise((resolve, reject) => {
		loggerObject = winston.createLogger({
			format: winston.format.combine(myFormat),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({
					filename: `./logs/${filename}`
				})
			]
		});
		resolve(true);
	});
};

getLogMessages = () => {
	const date = new Date();
	const filename =
		date.getFullYear() + '.' + formatDate(date.getMonth() + 1) + '.' + formatDate(date.getDate()) + '-dxestion.log';

	if (fs.existsSync(`./logs/${filename}`)) {
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream(`./logs/${filename}`)
		});

		lineReader.on('line', function(line) {
			io.emit('log message', line);
		});
	}
};

/* Function to set date format */
formatDate = function(n) {
	return n < 10 ? '0' + n : n;
};

module.exports = {
	initLogger(socketIO) {
		io = socketIO;
	},
	logger,
	createLogger,
	addToLog,
	getLogMessages
};
