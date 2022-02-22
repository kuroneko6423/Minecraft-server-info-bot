// https://github.com/kuroneko6423/Minecraft-server-info-bot

'use strict'
require('dotenv').config();

const  Discord = require("discord.js");
const fs = require('fs');

// 起動処理
//config関係
if(!fs.existsSync('./data/servers.json')) {
    console.log('servers.json が存在しません');
    console.log('servers.jsonを作成中...');
    fs.writeFileSync('./data/servers.json', '{}', err => {
        console.error(err);
    });
    console.log('完了しました!');
}
if(!fs.existsSync('./data/config.json')) {
    console.log('config.json が存在しない');
    console.log('config.jsonの作成...');
    fs.writeFileSync('./data/config.json', '{"defaultPrefix": "!"}', err => {
        console.error(err);
    });
    console.log('完了しました!');
}



//check if DISCORD_TOKEN is defined
if(!process.env.DISCORD_TOKEN) {
    console.log('環境変数DISCORD_TOKENが定義されていない');
    //create .env if it doesn't exist
    if(!fs.existsSync('./.env')) {
        console.log('.env が存在していません');
        console.log('.envの作成...');
        fs.writeFileSync('./.env', '#  configファイル','DISCORD_TOKEN=', err => {
            console.error('内部エラーが発生しました。エラーを表示します');
            console.error(err);
        });
        console.log('完了しました!');
        console.log('.env内にある項目を設定してください')
    }
    console.log('環境変数DISCORD_TOKENを設定するか、または .env');
}

const servers = require('./exports/exports.js');
const defaultPrefix = require('./data/config.json').defaultPrefix;

// Discord.js v13対応
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}


client.once('ready', () => {
    //set up status
    client.user.setStatus('online');
    client.user.setActivity(defaultPrefix + 'help', {  type: 'LISTENING'  });
    console.log('Ready!');
});


// messageイベントが非推奨になったらしいので message→messageCreateに変更

client.on('messageCreate', message => {
    //check that author isn't a bot
    if (message.author.bot) return;
    //get prefix from servers.json
    let prefix = servers.getPrefix(message.guild.id);
    //check if message is a command
    if(message.content.toLowerCase().startsWith(prefix)) {
        //get arguments.args[0] === command name
        const args = message.content.toLowerCase().slice(prefix.length).split(' ');
        //check if command exists
        if(!client.commands.has(args[0])) return;
        //execute command
        try {
            client.commands.get(args[0]).execute(message, args.slice(1, args.length), prefix);
        }
        catch(err) {
            console.error('内部エラーが発生しました。エラーを表示します');
            console.error(err);
            message.reply('コマンドの実行中に何か問題が発生しました');
        }
    }
    //safe commands, to retrieve the prefix if forgotten
    else if(message.content.toLowerCase().startsWith(defaultPrefix + 'help')) {
        //get arguments
        const args = message.content.toLowerCase().slice(prefix.length).split(' ');
        try {
            client.commands.get('help').execute(message, args.slice(1, args.length), prefix);
        }
        catch(err) {
            console.error('内部エラーが発生しました。エラーを表示します')
            console.error(err);
            message.reply('コマンドの実行中に何か問題が発生しました');
        }
    }
});

async function close() {
    console.log('シャットダウン中. . .');
    console.log('完了しました。');
    process.exit();
}

process.on('SIGINT', close);
process.on('SIGTERM', close);
client.login(process.env.DISCORD_TOKEN);