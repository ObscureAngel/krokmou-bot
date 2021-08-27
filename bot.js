const lo_discord = require('discord.js');
const lo_fs = require('fs');
const lo_path = require('path');
const lo_mysql = require('mysql');

// Reprise du token
var ls_token = fct_getToken('token.txt');

function fct_getToken(ps_relPath) {
	return lo_fs.readFileSync(ps_relPath,{ encoding: 'utf8' });
}

// Création d'une instance d'un client Discord
var lo_bot = new lo_discord.Client({autoReconnect: true});
lo_bot.la_commands = new lo_discord.Collection();

// #region Initialisation des variables
// Préfixe pour les commandes
const ls_prefix = "k!"

// Version du bot
const ls_version = "1.0";
const li_numeroVersion = 2;

// Activation du mode DEBUG
var lb_debugMode = true;

// Aide pour le bot
var ls_helpText = '```Markdown\n'
ls_helpText += 'Liste des commandes\n';
ls_helpText += '  - ' + ls_prefix + 'help ou ' + ls_prefix + '? Affiche ce message d\'aide\n';

// #endregion

// Récupération des commandes
const la_commandFiles = lo_fs.readdirSync('./commands').filter(ps_file => ps_file.endsWith('.js'));

for (var ls_file of la_commandFiles) {
	var lo_command = require(`./commands/${ls_file}`);

	ls_helpText += '  - ' + ls_prefix + lo_command.fs_nomCommande + ' ' + lo_command.fs_descriptionCommande + '\n';
	ls_helpText += '' + lo_command.fs_usageCommande + '\n\n';

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	lo_bot.la_commands.set(lo_command.fs_nomCommande, lo_command);
}

ls_helpText += '```';

// #region Création d'une connexion à la bdd
var lo_poolConnexionKrokmou = lo_mysql.createPool({
	host : "localhost",
	user : "root",
	password : ""
});

lo_poolConnexionKrokmou.getConnection(function(po_erreur, po_connexionKrokmou) {
	if (po_erreur) {
		console.error('Erreur lors de la connexion à la BDD');
		return;
	}
	
	console.log('Connecté au serveur MySQL');

	po_connexionKrokmou.query('USE krokmoubot', function(po_erreur, po_ligne) {
		po_connexionKrokmou.release();
		if (po_erreur == undefined) {
			console.log('Base connectée');
		}
		else {
			po_connexionKrokmou.query('CREATE DATABASE krokmoubot');
			po_connexionKrokmou.query('USE krokmoubot');
		}
	});
});
// #endregion

lo_bot.login(ls_token);

lo_bot.on('ready', () => {
	lo_bot.user.setPresence({
		activity: {
			name: 'son développeur...',
			type: 'LISTENING'
		},
		status: 'online'
	});
	
	console.log(new Date() + ' : Logged in as '+ lo_bot.user.tag);
});

// En cas d'erreur quelquonque
lo_bot.on('error', po_error => {
	// On l'affiche
	console.error(new Date() + ' : ' + po_error.message);
});

lo_bot.on('message', po_message => {
	// Contrôles de l'auteur du message et du préfixe
	if (!po_message.content.startsWith(ls_prefix)) return;

	// Commande handler
	var la_parametres = po_message.content.slice(ls_prefix.length).trim().split(/ +/);
	var ls_nomCommande = la_parametres.shift().toLowerCase();

	if (ls_nomCommande == 'help' || ls_nomCommande == '?') {
		po_message.channel.send(ls_helpText);
	} 
	else {
		if (!lo_bot.la_commands.has(ls_nomCommande)) {
			po_message.reply('la commande ' + ls_prefix + ls_nomCommande + ' n\'existe pas.')
			po_message.channel.send('k!help');
			return;
		}

		var lo_command = lo_bot.la_commands.get(ls_nomCommande);
	
		try {
			lo_command.execute(lo_poolConnexionKrokmou, po_message, la_parametres);
		} catch (po_error) {
			po_message.reply('une erreur est survenue lors du traitement de la commande ' + ls_prefix + ls_nomCommande + '.');
			console.error(po_error.message);
		}
	}
	
});
