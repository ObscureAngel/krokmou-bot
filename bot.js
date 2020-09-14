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
lo_bot.commands = new lo_discord.Collection();

const commandFiles = lo_fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	lo_bot.commands.set(command.ls_name, command);
}

// #region Création d'une connexion à la bdd
/*var lo_connexionKrokmou = lo_mysql.createConnection({
    host : "localhost",
    user : "root",
    password : ""
});

lo_connexionLoupGabot.connect(function(lo_erreur) {
    if (lo_erreur) {
        console.error('Erreur lors de la connexion à la BDD');
        return;
    }
    
    console.log('Connecté au serveur MySQL');

    lo_connexionLoupGabot.query('USE loupGabot', function(lo_erreur, lo_ligne) {
        if (lo_erreur == undefined) {
            console.log('Base connectée');
        }
        else {
            lo_connexionLoupGabot.query('CREATE DATABASE loupGabot');
            lo_connexionLoupGabot.query('USE loupGabot');
        }
    });
});*/
// #endregion

// #region Initialisation des variables
// Préfixe pour les commandes
const ls_prefix = "k!"

// Version du bot
const ls_version = "1.0";
const li_numeroVersion = 2;

// Activation du mode DEBUG
var lb_debugMode = true;

// Aide pour le bot
var ls_helpText = "```Liste des commandes\n";
ls_helpText += " - " + ls_prefix + "aide  Affiche ce message d'aide\n";
ls_helpText += " - " + ls_prefix + "version  Affiche les informations de version du bot\n";
ls_helpText += " - " + ls_prefix + "debug  Active ou désactive le mode débug.\n";
ls_helpText += "   Syntaxe : " + ls_prefix + "debug true|false";
ls_helpText += "   Debug activé : " + lb_debugMode + "\n";
ls_helpText += "```";

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
    
    /*lo_connexionLoupGabot.query("SELECT bi_numeroVersion FROM lg_version", function (lo_erreur, lo_ligne) {
        if (lo_ligne == undefined) {
            fa_structureBaseOrigine.forEach(fs_requete => {
                lo_connexionLoupGabot.query(fs_requete);
            });
            console.log('Base crée');
        }
        else {
            if(lo_ligne[0].bi_numeroVersion != li_numeroVersion) {
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
    if (!po_message.content.startsWith(ls_prefix) || po_message.author.bot) return;

    var args = po_message.content.slice(ls_prefix.length).trim().split(/ +/);
    var command = args.shift().toLowerCase();
    switch (command) {
        case 'ping':
            lo_bot.commands.get('ping').execute(po_message, args);
            break;
        
        case 'kick':
            lo_bot.commands.get('kick').execute(po_message, args);
            break;
        default:
            break;
    }
    //if (command === 'ping') lo_bot.commands.get('ping').execute(po_message, args);
    
});
