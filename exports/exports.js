const defaultPrefix = require('../data/config.json').defaultPrefix;
const fs = require('fs');

module.exports = {
    getPrefix(id) {
        try {
            let servers = JSON.parse(fs.readFileSync('./data/servers.json'));
            //check if the guild has a custom prefix
            if(servers[id] && servers[id].prefix.value) {
                return servers[id].prefix.value;
            }
            return defaultPrefix;
        }
        catch {
            return defaultPrefix;
        }
    },
    setPrefix(id, prefix) {
        return new Promise((resolve, reject) => {
            try {
                let servers = JSON.parse(fs.readFileSync('./data/servers.json'));
                //check if the prefix key exists
                if(!servers.hasOwnProperty(id)) { servers[id] = { prefix: {} } }
                //set the new prefix
                servers[id].prefix.value = prefix;

                fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 4));
                resolve({ message: 'prefixの変更に成功しました。新しいprefix: ' + prefix });
            }
            catch(err) {
                reject({ message: 'prefixを変更しようとしたときにエラーが発生しました。Discordサーバーに参加してerrorをお伝えください。', error: err });
            }
        });
    },
    getRoles(id) {
        try {
            let servers = JSON.parse(fs.readFileSync('./data/servers.json'));
            //check if the guild has any admin role
            if(typeof(servers[id].prefix.roles) !== '未定義') {
                return servers[id].prefix.roles;
            }
            return [];
        }
        catch {
            return [];
        }
    },
    addRole(id, roles) {
        return new Promise((resolve, reject) => {
            try {
                let servers = JSON.parse(fs.readFileSync('./data/servers.json'));
                //check that the key roles exists
                if(!servers.hasOwnProperty(id)) { servers[id] = { prefix: { roles: [] } } }
                else if(!servers[id].prefix.hasOwnProperty('ロール')) { servers[id].prefix.roles = [] }

                roles.forEach(role => {
                    //correctly format role into role id
                    if(role.indexOf('<') >= 0) {
                        role = role.slice(3, -1);
                    }
                    //check if the role to add doesn't already exist
                    if(servers[id].prefix.roles.indexOf(role) < 0) {
                        servers[id].prefix.roles.push(role);
                    }
                });

                fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 4));
                resolve({ message: '権限のあるロールの更新に成功しました' });
            }
            catch(err) {
                reject({ message: '認証されたロールを変更しようとするとエラーが発生しました。Discordサーバーに参加して報告してください。', error: err })
            }
        });
    },
    removeRole(id, roles) {
        return new Promise((resolve, reject) => {
            try {
                let servers = JSON.parse(fs.readFileSync('./data/servers.json'));
                //check that the key roles exists
                if(!servers.hasOwnProperty(id)) { servers[id] = { prefix: { roles: [] } } }
                else if(!servers[id].prefix.hasOwnProperty('ロール')) { servers[id].prefix.roles = [] }

                roles.forEach(role => {
                    //correctly format role into role id
                    if(role.indexOf('<') >= 0) {
                        role = role.slice(3, -1);
                    }
                    //check if the role to delete exists
                    if(servers[id].prefix.roles.indexOf(role) >= 0) {
                        servers[id].prefix.roles.splice(servers[id].prefix.roles.indexOf(role), 1);
                    }
                });

                fs.writeFileSync('./data/servers.json', JSON.stringify(servers, null, 4));
                resolve({ message: '権限のあるロールの更新に成功しました' });
            }
            catch(err) {
                reject({ message: '認証されたロールを変更しようとするとエラーが発生しました。Discordサーバーに参加して報告してください。', error: err })
            }
        });
    }
}