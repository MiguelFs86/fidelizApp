require('./config/config');
require('./utils/folder_tree');
require('./utils/admin_user');

const mongoose = require('./utils/database');
const path = require('path');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cron = require('./utils/crontasks');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

/* Init services that require socket connection */
require('./utils/session').initSession(io);
require('./utils/socket').initSocket(io);
require('./utils/logger').initLogger(io);
const { createLogger, addToLog, getLogMessages } = require('./utils/logger');

/* Create logger */
createLogger().then(() => {
	addToLog('info', 'App started');
});

/* Set Helmet middleware */
app.use(helmet());

/* Compress all responses */
app.use(compression());

/* Add cookies support */
app.use(cookieParser());

/* Add express sessions middleware */
app.use(session({ secret: 'session-secret', resave: false, saveUninitialized: true, cookie: { secure: true } }));

/* Add headers */
app.use((req, res, next) => {
	const origin = req.get('origin');
	res.header('Access-Control-Allow-Origin', origin);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
	);

	/* intercept OPTIONS method */
	if (req.method === 'OPTIONS') {
		res.sendStatus(204);
	} else {
		next();
	}
});

/* Allow file uploading */
app.use(fileUpload());

/* parse application/x-www-form-urlencoded */
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
/* Parse raw requests */
app.use(bodyParser.raw());

/* parse application/json */
app.use(bodyParser.json());

/* Global route config */
app.use(require('./routes/index'));

/* Enable public directory */
app.use(express.static(path.resolve(__dirname, '../public/')));

/* Set the folder to store uploads */
app.use('/files', express.static(path.resolve(__dirname, '../uploads')));

/* Connect to database */
mongoose.createConnection();

/* Start app */
server.listen(process.env.PORT, () => {
	addToLog('info', `Environment => ${process.env.NODE_ENV}`);
	addToLog('info', `HTTP Listening on port ${process.env.PORT}`);
	addToLog('info', `HTTPS Listening on port ${process.env.SSL_PORT}`);
	addToLog('info', `Socket server Listening on port ${process.env.SOCKET_PORT}`);
	/* Start cron tasks */
	cron.startTask();
	io.on('connection', (socket) => {
		socket.on('log message', (message) => {
			getLogMessages();
		});
	});
});
