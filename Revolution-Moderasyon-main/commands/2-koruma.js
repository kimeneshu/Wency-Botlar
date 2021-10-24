const Command = require("../base/Command.js")
class Koruma extends Command {
    constructor(client) {
        super(client, {
            name: "Koruma",
            aliases: ["koruma"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return
        if(!args[0]) {
            message.guild.roles.cache.get("870851045016883281").setPermissions(0) // Führer
            message.guild.roles.cache.get("852194278519603211").setPermissions(0) // Owner
            message.guild.roles.cache.get("852194278507806777").setPermissions(0) // CEO    
            message.guild.roles.cache.get("871446386602831922").setPermissions(0) // Bael
            message.guild.roles.cache.get("866402982035718144").setPermissions(0) // Çift Yıldız
            message.channel.send(`${this.client.no} Sunucumuzun tüm rolleri güvenlik açısından devre dışı bırakılmıştır.`)
        }
        if(args[0] == "kapat") {
            message.guild.roles.cache.get("870851045016883281").setPermissions(8)
            message.guild.roles.cache.get("852194278519603211").setPermissions(2684350149)
            message.guild.roles.cache.get("852194278507806777").setPermissions(268436608)
            message.guild.roles.cache.get("871446386602831922").setPermissions(128)
            message.guild.roles.cache.get("866402982035718144").setPermissions(128)
            message.channel.send(`${this.client.ok} Sunucumuzun yönetici rolleri tekrardan aktif hale getirilmiştir.`)
        } 
    }
}

module.exports = Koruma;
