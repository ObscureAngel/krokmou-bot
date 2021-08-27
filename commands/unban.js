module.exports = {
	fs_nomCommande: 'unban',
	fs_descriptionCommande: 'Annuler un bannissement.',
	execute(po_poolConnexionKrokmou, po_message, pa_parametres) {
		/**
		 * Lors du ban on va insérer une ligne dans une base de données avec l'id du modo, l'id du banni, la raison, le nombre de jours de suppression des messages et la date+heure
		 * Dans la réponse du ban si on a pu insérer on donnera un id de ban (colonne en auto-incrément)
		 * Si on arrive pas à insérer, on unban tout de suite puisqu'on peut pas générer d'id de ban (colonne en auto-incrément) et on envoi un message pour en informer les modos
		 * Lorsqu'on voudra unban quelqu'un il suffira de faire une requête avec cet id et de prendre l'id du banni pour l'unban
		 * L'enregistrement sera alors modifié pour indiquer que la personne a été unban et on ajoutera la date+heure et l'id du modo qui a unban
		 */
		
		var fs_bannedMemberUsername = pa_parametres.shift();
		var fo_guildMemberManager = po_message.guild.members;

		po_poolConnexionKrokmou.getConnection(function(po_erreur, po_connexionKrokmou) {
			if (po_erreur) {
				console.error('Erreur lors de la connexion à la BDD');
				return;
			}
			
			var fs_query = "SELECT ban_id, ban_memberId FROM kb_ban";
			fs_query += " WHERE ban_memberUsername LIKE '" + fs_bannedMemberUsername + "%' AND ban_unbanDate IS NULL";

			po_connexionKrokmou.query(fs_query, function (po_erreur, po_editionBanOfUser) {
				po_connexionKrokmou.release();

				if (po_erreur == undefined && po_editionBanOfUser.length == 1) {
					var fd_dateEnregistrement = new Date();

					fs_query = "UPDATE kb_ban SET";
					fs_query += " ban_unbanDate = '" + fd_dateEnregistrement.toISOString().slice(0, 19).replace('T', ' ') + "',";
					fs_query += " ban_unbanModId = " + po_message.author.id;
					fs_query += " WHERE ban_id = " + po_editionBanOfUser[0].ban_id;

					po_connexionKrokmou.query(fs_query, function (po_erreur, po_ligne) {
						po_connexionKrokmou.release();

						if (po_erreur == undefined) {
							fo_guildMemberManager.unban(po_editionBanOfUser[0].ban_memberId)
								.then(function (po_user) {
									return po_message.reply('tu as débanni ' + fs_bannedMemberUsername + ' !');
								})
								.catch(function (po_erreur) {
									console.error(po_erreur.message);
									return po_message.reply('une erreur est survenue. ' + fs_bannedMemberUsername + ' n\'a pas été débanni.')
								});
						}
						else {
							console.error(po_erreur);
							return po_message.reply('une erreur est survenue. ' + fs_bannedMemberUsername + ' n\'a pas été débanni.');
						}
					});
				}
				else if (po_ligne.length == 0) {
					po_connexionKrokmou.release();

					return po_message.reply('impossible de débannir ' + fs_bannedMemberUsername + ', il est déjà débanni du serveur.');
				}
				else {
					po_connexionKrokmou.release();

					console.error(po_erreur);
					return po_message.reply("une erreur est survenue lors de la vérification de l'historique de ban. " + fs_bannedMemberUsername + " n'a pas été banni.");
				}
			});
		});
	},
};