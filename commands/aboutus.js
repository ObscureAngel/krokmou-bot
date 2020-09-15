module.exports = {
	ls_name: 'aboutus',
	ls_description: 'Affiche les informations du bot.',
	execute(lo_message, la_args) {
        ls_aboutUs = '';

		lo_message.channel.send('Pong.');
	},
};