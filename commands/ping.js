module.exports = {
	ls_name: 'ping',
	ls_description: 'Pour faire du ping-pong!',
	execute(lo_message, la_args) {
		lo_message.channel.send('Pong.');
	},
};