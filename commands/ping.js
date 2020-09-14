module.exports = {
	ls_name: 'ping',
	ls_description: 'Ping!',
	execute(lo_message, la_args) {
		lo_message.channel.send('Pong.');
	},
};