module.exports = {
	fs_nomCommande: 'ban',
	fs_descriptionCommande: 'Ban someone',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		if (!po_message.mentions.users.size) {
			return po_message.reply('vous devez mentionner quelqu\'un pour le bannir.');
		}
		
		var lo_taggedUser = po_message.mentions.users.first();
		var lo_guildMemberManager = po_message.guild.members;

		// Mention de la persionne à bannin
		pa_parametres.shift();

		// Nombre de jours de suppression des messages
		li_daysDeletedMessages = pa_parametres.shift();

		// Raison invoquée
		ls_reason = pa_parametres.join(' ');

		lo_guildMemberManager.fetch(lo_taggedUser.id)
			.then(function (po_guildMember){
				po_guildMember.ban(li_daysDeletedMessages, ls_reason)
					.then(function (po_bannedGuildMember) {
						
						return po_message.reply('tu as banni ' + lo_taggedUser.username + ' ! Les messages envoyés depuis ' + li_daysDeletedMessages + ' jour(s) ont été supprimés.');
					})
					.catch(function (po_error) {
						console.error(po_error.message);
						return po_message.reply('une erreur est survenue. ' + lo_taggedUser.username + ' n\'a pas été banni.')
					});
			})
			.catch(function (po_error) {
				console.error(po_error.message);
				return po_message.reply('une erreur est survenue. ' + lo_taggedUser.username + ' n\'a pas été banni.')
			});
	},
};