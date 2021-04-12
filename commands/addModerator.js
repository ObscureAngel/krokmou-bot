module.exports = {
	fs_nomCommande: 'addModerator',
	fs_descriptionCommande: 'Ajoute un modérateur au pool de modérateur de la base',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		if (!po_message.mentions.users.size) {
			return po_message.reply('vous devez mentionner quelqu\'un pour l\'ajouter au pool de modérateurs.');
		}

		var lo_utilisateurMentionne = po_message.mentions.users.first();
		var lo_guildMemberManager = po_message.guild.members;

		lo_guildMemberManager.fetch(lo_utilisateurMentionne.id)
			.then(function (po_guildMember){
				po_connexionKrokmou.query("SELECT * FROM kb_moderator", function (po_erreur, po_ligne) {
					if (po_erreur == undefined) {
						return po_message.reply(lo_utilisateurMentionne.username + ' a bien été ajouté au pool des modérateurs.');
					}
					else {
						return po_message.reply(lo_utilisateurMentionne.username + ' n\'a pas pu être ajouté au pool des modérateurs.');
					}
				});
			})
			.catch(function (po_error) {
				console.error(po_error.message);
				return po_message.reply(lo_utilisateurMentionne.username + ' est introuvable.')
			});
	},
};