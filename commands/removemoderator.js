module.exports = {
	fs_nomCommande: 'removemoderator',
	fs_descriptionCommande: 'Ajoute un modérateur au pool de modérateur de la base',
	execute(po_poolConnexionKrokmou, po_message, pa_parametres) {
		if (!po_message.mentions.users.size) {
			return po_message.reply('vous devez mentionner quelqu\'un pour le retirer du pool des modérateurs.');
		}

		var fo_utilisateurMentionne = po_message.mentions.users.first();
		var fo_guildMemberManager = po_message.guild.members;

		fo_guildMemberManager.fetch(fo_utilisateurMentionne.id)
			.then(function (po_guildMember) {

				po_poolConnexionKrokmou.getConnection(function(po_erreur, po_connexionKrokmou) {
					if (po_erreur) {
						console.error('Erreur lors de la connexion à la BDD');
						return;
					}

					var fd_dateEnregistrement = new Date();
					var fs_query = "UPDATE kb_moderator SET mod_unregistredDate = '" + fd_dateEnregistrement.toISOString().slice(0, 19).replace('T', ' ') + "'"; 
					fs_query += ", mod_active = 0";
					fs_query += " WHERE mod_id = " + fo_utilisateurMentionne.id;

					po_connexionKrokmou.query(fs_query, function (po_erreur, po_ligne) {
						po_connexionKrokmou.release();
						
						if (po_erreur == undefined) {
							return po_message.reply(fo_utilisateurMentionne.username + ' a bien été retiré du pool des modérateurs.');
						}
						else {
							console.error(po_erreur);
							return po_message.reply(fo_utilisateurMentionne.username + ' n\'a pas pu être retiré du pool des modérateurs.');
						}
					});
				});
			})
			.catch(function (po_error) {
				console.error(po_error.message);
				return po_message.reply(fo_utilisateurMentionne.username + ' est introuvable.')
			});
	},
};
