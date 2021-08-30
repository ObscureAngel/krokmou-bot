module.exports = {
	fs_nomCommande: 'ping',
	fs_descriptionCommande: 'Affiche le temps de réponse du bot.',
    fs_usageCommande: 'k!ping',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		po_message.reply('Ping : ' + ((Date.now() - Date.parse(po_message.createdAt))/1000) + ' secondes');
	},
};