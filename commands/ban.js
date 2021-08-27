module.exports = {
	fs_nomCommande: 'ban',
	fs_descriptionCommande: 'Ban someone',
	fs_usageCommande: 'ban ',
	execute(po_poolConnexionKrokmou, po_message, pa_parametres) {
		if (!po_message.mentions.users.size) {
			return po_message.reply('vous devez mentionner quelqu\'un pour le bannir.');
		}
		
		var fo_taggedUser = po_message.mentions.users.first();
		var fo_guildMemberManager = po_message.guild.members;

		/**
		 * mbeacco - 17/04/2021
		 * Je retire la mention du membre à bannir du message.
		 */
		pa_parametres.shift();

		// Nombre de jours de suppression des messages
		var fi_daysDeletedMessages = pa_parametres.shift();

		// Raison invoquée
		var fs_reason = pa_parametres.join(' ');
		if (fs_reason.length > 90) {
			return po_message.reply(' la raison invoquée ne doit pas dépasser 90 caractères. Longueur actuelle : ' + fs_reason.length);
		}

		fo_guildMemberManager.fetch(fo_taggedUser.id)
			.then(function (po_guildMember) {

				/**
				 * mbeacco - 17/04/2021
				 * On vérifie que le membre n'est pas déjà banni
				 */
				po_poolConnexionKrokmou.getConnection(function(po_erreur, po_connexionKrokmou) {
					if (po_erreur) {
						console.error('Erreur lors de la connexion à la BDD');
						return;
					}
					
					var fs_query = "SELECT ban_memberId FROM kb_ban";
					fs_query += " WHERE ban_memberId = " + po_guildMember.user.id + " AND ban_unbanDate IS NULL";

					po_connexionKrokmou.query(fs_query, function (po_erreur, po_ligne) {
						po_connexionKrokmou.release();

						if (po_erreur == undefined && po_ligne.length == 0) {

							/**
							 * mbeacco - 17/04/2021
							 * Si le membre n'est pas déjà banni, on insère une ligne
							 */
							var fd_dateEnregistrement = new Date();

							fs_query = "INSERT INTO kb_ban (ban_memberId, ban_memberUsername, ban_reason, ban_daysDeletingMsg, ban_banDate, ban_banModId) VALUES ("; 
							fs_query += po_guildMember.user.id + ", ";
							fs_query += "'" + po_guildMember.user.tag + "', ";
							fs_query += "'" + fs_reason.replace("'", "\\'") + "', ";
							fs_query += fi_daysDeletedMessages + ", ";
							fs_query += "'" + fd_dateEnregistrement.toISOString().slice(0, 19).replace('T', ' ') + "', ";
							fs_query += po_message.author.id;
							fs_query += ")";

							po_poolConnexionKrokmou.getConnection(function(po_erreur, po_connexionKrokmou) {
								
							po_connexionKrokmou.query(fs_query, function (po_erreur, po_ligne) {
								po_connexionKrokmou.release();

								if (po_erreur == undefined) {

									/**
									 * mbeacco - 17/04/2021
									 * Si l'insertion s'est bien passé, on déclanche le bannissement du membre
									 */
									fo_guildMemberManager.ban(po_guildMember.user.id, {days: fi_daysDeletedMessages, reason: fs_reason})
										.then(function (po_bannedGuildMember) {
											return po_message.reply('tu as banni ' + po_guildMember.user.username + ' ! Les messages envoyés depuis ' + fi_daysDeletedMessages + ' jour(s) ont été supprimés.');
										})
										.catch(function (po_error) {
											console.error(po_error.message);
											return po_message.reply('une erreur est survenue. ' + fo_taggedUser.username + ' n\'a pas été banni.')
										});
								}
								else {
									console.error(po_erreur);
									return po_message.reply("le ban de " + po_guildMember.user.username + " n'a pas pu être ajouté à son historique. Il ne sera donc pas banni.");
								}
							});
							});
						}
						else if (po_ligne.length != 0) {
							/**
							 * mbeacco - 17/04/2021
							 * Si il est déjà banni on informe le modérateur
							 */
							return po_message.reply('impossible de bannir ' + po_guildMember.user.username + ', il est déjà banni du serveur.');
						}
						else {
							console.error(po_erreur);
							return po_message.reply("une erreur est survenue lors de la vérification de l'historique de ban. " + po_guildMember.user.username + " n'a pas été banni.");
						}
					});
				});
			})
			.catch(function (po_error) {
				console.error(po_error.message);
				return po_message.reply('le membre ' + fo_taggedUser.username + ' n\'a pas été trouvé sur le serveur.')
			});
	},
};