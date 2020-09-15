module.exports = {
    ls_name: 'ban',
    ls_description: 'Ban someone',
    execute(lo_message, la_param) {
        if (!lo_message.mentions.users.size) {
			return lo_message.reply('vous devez mentionner quelqu\'un pour le bannir.');
        }
        
        var lo_taggedUser = lo_message.mentions.users.first();
        var lo_guildMemberManager = lo_message.guild.members;

        // Mention de la persionne à bannin
        la_param.shift();

        // Nombre de jours de suppression des messages
        li_daysDeletedMessages = la_param.shift();

        // Raison invoquée
        ls_reason = la_param.join(' ');

        lo_guildMemberManager.fetch(lo_taggedUser.id)
            .then(function (po_guildMember){
                po_guildMember.ban(li_daysDeletedMessages, ls_reason)
                    .then(function (po_bannedGuildMember) {
                        return lo_message.reply('tu as banni ' + lo_taggedUser.username + ' ! Les messages envoyés depuis ' + li_daysDeletedMessages + ' jour(s) ont été supprimés.');
                    })
                    .catch(function (po_error) {
                        console.error(po_error.message);
                        return lo_message.reply('une erreur est survenue. ' + lo_taggedUser.username + ' n\'a pas été banni.')
                    });
            })
            .catch(function (po_error) {
                console.error(po_error.message);
                return lo_message.reply('une erreur est survenue. ' + lo_taggedUser.username + ' n\'a pas été banni.')
            });
    },
};