module.exports = {
	fs_nomCommande: 'ping',
	fs_descriptionCommande: 'Pour faire du ping-pong !',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		po_message.channel.send('Pong.');
		po_connexionKrokmou.query("SELECT * FROM kb_ban");
	},
};