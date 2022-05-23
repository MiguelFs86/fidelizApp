require('../config/config');
let io;

emitSocketMessage = (event, message) => {
	io.emit(event, message);
};

/* Function to set date format */
formatDate = (n) => {
	return n < 10 ? '0' + n : n;
};

getIO = () => {
	return io;
};

module.exports = {
	initSocket(socketIO) {
		io = socketIO;
	},
	getIO,
	emitSocketMessage
};
