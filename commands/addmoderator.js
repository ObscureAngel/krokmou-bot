module.exports = {
	fs_nomCommande: 'addmoderator',
	fs_descriptionCommande: 'Ajoute un modérateur au pool de modérateur de la base',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		if (!po_message.mentions.users.size) {
			return po_message.reply('vous devez mentionner quelqu\'un pour l\'ajouter au pool de modérateurs.');
		}

		var fo_utilisateurMentionne = po_message.mentions.users.first();
		var fo_guildMemberManager = po_message.guild.members;

		fo_guildMemberManager.fetch(fo_utilisateurMentionne.id)
			.then(function (po_guildMember) {

				var fd_dateEnregistrement = new Date();
				var fs_query = "INSERT INTO kb_moderator (mod_id, mod_tag, mod_active, mod_registredDate) VALUES ("; 
				fs_query += fo_utilisateurMentionne.id + ", ";
				fs_query += "'" + fo_utilisateurMentionne.tag + "', ";
				fs_query += "1, ";
				fs_query += "'" + fd_dateEnregistrement.toISOString().slice(0, 19).replace('T', ' ') + "'";
				fs_query += ")";

				po_connexionKrokmou.query(fs_query, function (po_erreur, po_ligne) {
					if (po_erreur == undefined) {
						return po_message.reply(fo_utilisateurMentionne.username + ' a bien été ajouté au pool des modérateurs.');
					}
					else {
						console.error(po_erreur);
						return po_message.reply(fo_utilisateurMentionne.username + ' n\'a pas pu être ajouté au pool des modérateurs.');
					}
				});
			})
			.catch(function (po_error) {
				console.error(po_error.message);
				return po_message.reply(fo_utilisateurMentionne.username + ' est introuvable.')
			});
	},
};
