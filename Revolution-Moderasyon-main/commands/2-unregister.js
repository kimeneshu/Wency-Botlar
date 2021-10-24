const Command = require("../base/Command.js");
const Discord = require("discord.js");
class Unregister extends Command {
    constructor(client) {
        super(client, {
            name: "Unregister",
            aliases: ["unregister", "kayıtsız", "un-register"]
        });
    }
    async run(message, args, data) {
        if (!message.member.roles.cache.some(r => this.client.config.roles.registerAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Kayıtsıza atmak istediğiniz kişiye belirtmeniz gerekmektedir.", message.author, message.channel)
        if(user.hasPermission("VIEW_AUDIT_LOG")) return this.client.yolla("Sunucumuzda yönetici olarak bulunan kişileri kayıtsıza atamazsınız.", message.author, message.channel)
        if(user.roles.cache.has(this.client.config.roles.botCommandRole) || user.roles.cache.has(this.client.config.roles.boosterRole)) return this.client.yolla("Sunucumuzda yetkili olarak bulunan ve ya sunucumuza takviye yapmış üyeleri kayıtsıza atamam.", message.author, message.channel)
        let banNum = this.client.unregisterLimit.get(message.author.id) || 0
        this.client.unregisterLimit.set(message.author.id, banNum + 1)
        if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla kayıtsız işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        user.roles.cache.has(this.client.config.roles.boosterRole) ? user.roles.set([this.client.config.roles.boosterRole, this.client.config.roles.unregisterRoles[0]]) : user.roles.set([this.client.config.roles.unregisterRoles[0]])
        user.voice.kick()
        const görüşürüz = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription("<@"+user+"> adlı kullanıcı sunucumuzda başarıyla kayıtsıza atılmıştır.")
        .setColor(message.member.displayHexColor)
        message.channel.send(görüşürüz).then(msg => { msg.delete({ timeout: 5000 }) }).then(m => message.react(this.client.ok));
    }
}
    module.exports = Unregister;