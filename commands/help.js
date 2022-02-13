const defaultPrefix = require('../data/config.json').defaultPrefix;

module.exports = {
    name: 'help',
    description: 'ヘルプメッセージを表示する',
    args: '[command]',
    execute(message, args, prefix) {
        const response = [];
        const {  commands  } = message.client;
        //send all commands if there are no arguments
        if(!args.length) {
            //fill response message
            response.push(`サーバprefix: ${prefix}`);
            response.push(`デフォルト prefix: ${defaultPrefix}`);
            response.push('コマンド: ');
            response.push(commands.map(command => command.name).join(', '));
            //send response
            return message.author.send(response, {  split: true  })
                .then(() => {
                    //tell user the repsonse is in the DMs if the command's been sent in a server
                    if(message.channel.type === 'dm') return;
                    message.reply('コマンドの一覧をDMで確認する');
                })
                .catch(error => {
                    message.reply('このサーバーのメンバーからのDMを必ず有効にしてください。');
                })
        }
        //get requested command
        const command = commands.get(args[0]);
        //check if command exists
        if(!command) return message.reply(command + ' does not exist');
        //fill response message
        response.push('名前: ' + command.name);
        response.push('Description: ' + command.description);
        let usage = 'Usage: ' + prefix + command.name;
        //add arguments to usage
        if(command.args) usage += ' ' + command.args;
        response.push(usage);
        //send response
        message.channel.send(response, {  split: true  });
    }
}