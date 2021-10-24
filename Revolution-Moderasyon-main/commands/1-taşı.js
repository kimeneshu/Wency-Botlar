const Command = require("../base/Command.js");
const Discord = require("discord.js");
class Taşı extends Command {
    constructor(client) {
        super(client, {
            name: "Taşı",
            aliases: ["taşı", "gönder", "yolla"]
        });
    }
    async run(message, args, data) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.moveAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        let yollanılıcak = this.client.channels.cache.find(c => c.id === args.slice(1).join(' '))
        if(!user) return this.client.yolla("Taşımak istediğiniz kişiyi düzgünce belirtin ve tekrar deneyin!", message.author, message.channel)
        if(!args.slice(1).join(' ')) return this.client.yolla("Kişiyi göndermek istediğiniz kanalın argümanlarını doğru bir şekilde yerleştirin!", message.author, message.channel)
        if(!yollanılıcak) return this.client.yolla("Kişiyi göndermek istediğiniz kanalın idsi hatalı!", message.author, message.channel)
        if(!user.voice.channel) return this.client.yolla("Belirttiğiniz kişi sunucumuzda ses kanallarında bulunmuyor!", message.author, message.channel)
        if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birisini kanallar arasında taşıyamazsın!", message.author, message.channel)
        const taşıdımişteyarram = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription("<@"+user+"> adlı kullanıcıyı başarıyla `"+yollanılıcak.name+"` adlı ses kanalına yolladınız.")
        .setColor("RANDOM")
        user.voice.setChannel(yollanılıcak)
        message.channel.send(taşıdımişteyarram).then(message => { message.delete({ timeout: 5000 }) }).then(m => message.react(this.client.ok));        
    }
}
    module.exports = Taşı;
