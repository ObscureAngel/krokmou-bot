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
ls_helpText += '  - ' + ls_prefix + 'help Affiche ce message d\'aide\n';

// #endregion

// Récupération des commandes
const la_commandFiles = lo_fs.readdirSync('./commands').filter(ps_file => ps_file.endsWith('.js'));

for (const ls_file of la_commandFiles) {
	const lo_command = require(`./commands/${ls_file}`);

	ls_helpText += '  - ' + ls_prefix + lo_command.fs_nomCommande + ' ' + lo_command.fs_descriptionCommande + '\n';

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	lo_bot.la_commands.set(lo_command.fs_nomCommande, lo_command);
}

ls_helpText += '```';

// #region Création d'une connexion à la bdd
var lo_connexionKrokmou = lo_mysql.createConnection({
	host : "localhost",
	user : "root",
	password : ""
});

lo_connexionKrokmou.connect(function(po_erreur) {
	if (po_erreur) {
		console.error('Erreur lors de la connexion à la BDD');
		return;
	}
	
	console.log('Connecté au serveur MySQL');

	lo_connexionKrokmou.query('USE krokmouBot', function(po_erreur, po_ligne) {
		if (po_erreur == undefined) {
			console.log('Base connectée');
		}
		else {
			lo_connexionKrokmou.query('CREATE DATABASE krokmouBot');
			lo_connexionKrokmou.query('USE krokmouBot');
		}
	});
});
// #endregion

lo_bot.login(ls_token);

lo_bot.on('ready', () => {
	console.log(new Date() + ' : Logged in as '+ lo_bot.user.tag);

	// Placer en dessous la création et les changements de structure de la base
	/*fa_structureBaseOrigine = [
		"CREATE TABLE lg_carte (bi_idCarte INT PRIMARY KEY AUTO_INCREMENT, bs_nomCarte TEXT, bs_descriptionCarte TEXT, bi_clefRole INT)",
		"CREATE TABLE lg_role (bi_idRole INT PRIMARY KEY AUTO_INCREMENT, bs_nomRole TEXT, bs_descriptionRole TEXT, bs_snowflakeRole TEXT)",
		"CREATE TABLE lg_canal (bi_idCanal INT PRIMARY KEY AUTO_INCREMENT, bs_nomCanal TEXT, bs_typeCanal TEXT, bs_snowflakeCanal TEXT, bs_snowflakeServeur TEXT)",
		"CREATE TABLE lg_version (bi_numeroVersion INT)",
		"INSERT INTO lg_version VALUES (" + li_numeroVersion + ")"
	];

	fa_structureBaseChangement = [
		"UPDATE lg_version SET bi_numeroVersion = " + li_numeroVersion,
		"ALTER TABLE lg_role CHANGE bi_snowflakeRole bs_snowflakeRole TEXT",
		"CREATE TABLE lg_canal (bi_idCanal INT PRIMARY KEY AUTO_INCREMENT, bs_nomCanal TEXT, bs_typeCanal TEXT, bs_snowflakeCanal TEXT, bs_snowflakeServeur TEXT)",
		"ALTER TABLE lg_carte ADD bb_isDistribuable TINYINT(1) DEFAULT 1"

	];*/
	
	/*lo_connexionLoupGabot.query("SELECT bi_numeroVersion FROM lg_version", function (po_erreur, po_ligne) {
		if (po_ligne == undefined) {
			fa_structureBaseOrigine.forEach(fs_requete => {
				lo_connexionLoupGabot.query(fs_requete);
			});
			console.log('Base crée');
		}
		else {
			if(po_ligne[0].bi_numeroVersion != li_numeroVersion) {
				fa_structureBaseChangement.forEach(fs_requete => {
					lo_connexionLoupGabot.query(fs_requete); 
				});
				console.log('Base mise à jour');
			}
		}
	});*/
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

	if (ls_nomCommande == 'help') {
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
			lo_command.execute(lo_connexionKrokmou, po_message, la_parametres);
		} catch (po_error) {
			po_message.reply('une erreur est survenue lors du traitement de la commande ' + ls_prefix + ls_nomCommande + '.');
			console.error(po_error.message);
		}
	}
	
});
