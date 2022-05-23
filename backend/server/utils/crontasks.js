const cron = require('node-cron');
const c = require('./gmail_sync');

const task = cron.schedule('0 */6 * * *', async () => {
	addToLog('info', 'Google contacts cron task executed!');
	await c.syncAllContacts();
	addToLog('info', 'Google contacts cron task ended!');
});

startTask = async () => {
	addToLog('info', 'Started crontask');
	// await c.syncAllContacts();
	task.start();
};

stopTask = () => {
	task.stop();
	addToLog('info', 'Stopped crontask');
};

module.exports = { startTask, stopTask };
