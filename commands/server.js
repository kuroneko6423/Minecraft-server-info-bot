const https = require('https');

module.exports = {
    name: 'server',
    description: 'Check server\'オンラインの状況やプレイヤー情報を データは5分ごとに更新されます',
    args: '<ip address>',
    execute(message, args) {
        //check if there're arguments
        if(!args.length) {
            message.reply('サーバーのIPアドレスを指定してください。');
            return;
        }
        //create new request
        const options = {
            hostname: 'api.mcsrvstat.us',
            port: 443,
            path: '/2/' + args[0],
            method: 'GET'
        }
        const request = https.request(options, response => {
            let str = '';
            response.on('data', data => {
                str += data;
            });
            response.on('end', () => {
                resp = JSON.parse(str);
                if(!resp.hostname) {
                    message.channel.send('IPアドレスを持つサーバーが見つかりませんでした。' + args[0]);
                    return;
                }
                //create answer message with default offline data
                let embed = {
                    color: '#00b300',
                    title: args[0],
                    author: {
                        name: 'Minecraft info',
                        url: 'https://github.com/kuroneko6423/Minecraft-server-info-bot'
                    },
                    thumbnail: {
                        url: 'https://api.mcsrvstat.us/icon/' + args[0]
                    },
                    fields: [{ name: 'Status', value: 'Offline' }],
                    image: {
                        url: 'https://api.mcsrvstat.us/icon/' + args[0]
                    },
                    timestamp: new Date(),
                    footer: {
                        text: '黒猫ちゃんbot \n Dataは5分ごとに更新されます。'
                    }
                };
                //fill with data if it's online
                if(resp.online) {
                    embed.fields[0].value = 'Online';
                    embed.fields.push({
                        name: 'Motd',
                        value: (resp.motd) ? resp.motd.clean.join('\n') : 'None'
                    });
                    embed.fields.push({
                        name: 'Online players',
                        value: resp.players.online + '/' + resp.players.max
                    });
                    embed.fields.push({
                        name: 'Version',
                        value: (Array.isArray(resp.version)) ? resp.version[0] : resp.version
                    });
                    embed.fields.push({
                        name: 'Plugins',
                        value: (resp.plugins) ? resp.plugins.names.join(', ') : 'None'
                    });
                    embed.fields.push({
                        name: 'Mods',
                        value: (resp.mods) ? resp.mods.names.join(', ') : 'None'
                    });
                }
                //send answer
                message.channel.send({ embed: embed });
            });
        });
        //error handling
        request.on('error', err => {
            console.log(err);
            message.channel.send('サーバーの情報を取得する際にエラーが発生しました。');
        })
        //close request
        request.end()
    }
}
