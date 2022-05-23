const Session = require('../models/session');
let io;

createSession = async (store, session, sessionID) => {
	try {
		const existingSession = await Session.find({ store: store._id });
		if (existingSession.length >= parseInt(store.allowed_connections)) {
			return {
				ok: false,
				message: `Yo have reached the connections limit for this store: ${store.allowed_connections}`
			};
		} else {
			const newSession = new Session({
				store: store._id,
				session: session,
				sessionID: sessionID
			});
			await newSession.save();
			io.emit('session created', newSession);
			return { ok: true, session: newSession };
		}
	} catch (err) {
		return { ok: false, message: err };
	}
};

destroySession = async (sessionID) => {
	try {
		if (sessionID !== null && sessionID !== 'null') {
			const deletedSession = await Session.findByIdAndDelete({ _id: sessionID });
			io.emit('session destroy', deletedSession);
		}
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	initSession(socketIO) {
		io = socketIO;
	},
	createSession,
	destroySession
};
