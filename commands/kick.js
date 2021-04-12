module.exports = {
	fs_nomCommande: 'kick',
	fs_descriptionCommande: 'Kick someone',
	execute(po_connexionKrokmou, po_message, pa_parametres) {
		if (!po_message.mentions.users.size) {
			return po_message.reply('vous devez mentionner quelqu\'un pour le kick.');
		}
		
		var lo_taggedUser = po_message.mentions.users.first();
		var lo_guildMemberManager = po_message.guild.members;

		pa_parametres.shift();
		ls_reason = pa_parametres.join(' ');

		lo_guildMemberManager.fetch(lo_taggedUser.id)
			.then(function (po_guildMember){
				//po_guildMember.kick(ls_reason);
				return po_message.reply('tu as kick ' + lo_taggedUser.username + ' !');
			})
			.catch(function (po_error) {
				console.error(po_error.message);
				return po_message.reply('une erreur est survenue. ' + lo_taggedUser.username + ' n\'a pas été kick.')
			});
	},
};