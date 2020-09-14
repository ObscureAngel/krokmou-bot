module.exports = {
    ls_name: 'kick',
    ls_description: 'Kick someone',
    execute(lo_message, la_param) {
        if (!lo_message.mentions.users.size) {
			return lo_message.reply('you need to tag a user in order to kick them!');
        }
        
        var lo_taggedUser = lo_message.mentions.users.first();
        var lo_guildMemberManager = lo_message.guild.members;

        la_param.shift();
        ls_reason = la_param.join(' ');

        lo_guildMemberManager.fetch(lo_taggedUser.id)
            .then(function (po_guildMember){
                //po_guildMember.kick(ls_reason);
                return lo_message.reply('tu as banni ' + lo_taggedUser.username + ' !');
            })
            .catch(function (po_error) {
                console.error(po_error.message);
                return lo_message.reply('une erreur est survenue. ' + lo_taggedUser + ' n\'a pas été banni.')
            });
    },
};