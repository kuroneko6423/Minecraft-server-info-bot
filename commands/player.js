const mojang = require('mojang-api');
const https = require('https');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'player',
    description: 'プレイヤーの名前、UUID、スキン、ケープ、名前の履歴を表示します',
    args: '<uuid/name>',
    execute(message, args) {
        //check that a value is sent
        if(!args.length) {
            message.reply('プレイヤーを指定してください');
            return;
        }
        //get uuid
        this.getUuid(args[0], (err, uuid) => {
            if(err) {
                message.channel.send('無効なUUIDです。');
                return;
            }
            //check that uuid exists
            mojang.profile(uuid, (err, resp) => {
                if(err) {
                    message.reply('そのプレイヤーのuuidは存在しません');
                    return;
                }
                //get name history
                mojang.nameHistory(uuid, (err, resp1) => {
                    if(err) {
                        message.reply('データを取得しようとしてエラーが発生しました');
                        console.log(err);
                        return;
                    }
                    let nameHistory = [];
                    resp1.forEach(element => {
                        nameHistory.push(element.name);
                    });
                    nameHistory = nameHistory.join('\n');
                    //create embed message
                    let embed = new MessageEmbed()
                    .setColor("#00b300")
                    .setTitle(resp.name + "のプロフィール")
                    .setDescription(`${resp.id}`)
                    .addField("スキン", `https://crafatar.com/skins/${resp.id}.png`, true)
                    .setAuthor({name: "Minecraft Info", url: 'https://github.com/kuroneko6423/Minecraft-server-info-bot'})
                    .setThumbnail(`https://crafatar.com/avatars/${resp.id}.png?overlay'`)
                    .setImage(`https://crafatar.com/renders/body/${resp.id}.png?overlay`)
                    .setTimestamp(new Date())
                    .setFooter({text: "Created by 黒猫ちゃん | データは20分ごとに更新されます"});
                    //check if cape exists
                    let cape = 'https://crafatar.com/capes/' + resp.id + '.png';
                    const req = https.request(cape, res => {
                        if(res.statusCode == 200) {
                            embed.addField('ケープ', cape);
                        }
                        embed.addField('名前履歴', nameHistory );
                        //send embed
                        message.channel.send({embeds: [embed]});
                    });
                    req.on('error', err => {
                        console.log(err);
                        message.reply('ケープの取得中にエラーが発生しました。');
                    })
                    req.end();
                });
            });
        });
        
    },
    //function to get uuid from uuid/name
    getUuid(value, cb) {
        let error = false;
        let regex = /^[a-f0-9]{32}$/i //regex for uuids
        if(!value.match(regex)) {
            mojang.nameToUuid(value, (err, resp) => {
                if(err || !resp.length) {
                    error = true;
                    cb(error, null);
                    return;
                }
                cb(error, resp[0].id);
            });
        }
        else { cb(error, value); }
    }
}
