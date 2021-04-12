module.exports = {
	fs_nomCommande: 'aboutus',
	fs_descriptionCommande: 'Affiche les informations du bot.',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		ls_aboutUs = '';

		po_message.channel.send('Pong.');
	},
};