const defaultPrefix = require('../data/config.json').defaultPrefix;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'ヘルプを表示します',
    args: '[command]',
    execute(message, args, prefix) {
        const response = [];
        const {  commands  } = message.client;
        //send all commands if there are no arguments
        if(!args.length) {
            let embed = new MessageEmbed()
            .setColor("#00b300")
            .setTitle("ヘルプ")
            .setAuthor({name: "Minecraft Info", url: 'https://github.com/kuroneko6423/Minecraft-server-info-bot'})
            .addFields([
                {name: "サーバーprefix", value: `${prefix}`, inline: true},
                {name: "デフォルトprefix", value: `${defaultPrefix}`, inline: true},
                {name: "コマンドリスト", value: `${commands.map(command => command.name).join('\n')}`}
            ])
            //send response
            return message.author.send({embeds: [embed]})
                .then(() => {
                    //tell user the repsonse is in the DMs if the command's been sent in a server
                    if(message.channel.type === 'dm') return;
                    message.reply({
                        content: 'DMで確認してください'
                    });
                })
                .catch(error => {
                    message.reply({
                        content: 'このサーバーのメンバーからのDMを有効にしてください。'
                    });
                })
        }
        //get requested command
        const command = commands.get(args[0]);
        //check if command exists
        if(!command) return message.reply(`コマンド ${command} は存在しません`);
        //fill response message
        let embed = new MessageEmbed()
        .setTitle(command.name)
        .setDescription(command.description)
        .addField("使用方法", `${prefix}${command.name} ${command.args ?? ""}`);
        //send response
        message.channel.send(embed);
    }
}