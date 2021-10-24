const Command = require("../base/Command.js");
const Discord = require("discord.js")
class Voicekick extends Command {
    constructor(client) {
        super(client, {
            name: "Bağlantı-Kes",
            aliases: ["kes", "voicekick", "voice-kick", "at"]
        });
    }
    async run(message, args, data) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.moveAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user.voice.channel) return this.client.yolla("Bağlantısını kesmek istediğiniz kullanıcı sesli odalarda bulunmuyor.", message.author, message.channel)
        if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birinin ses kanallarında ki bağlantısını kesemezsin.", message.author, message.channel)
        const attımknk = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription("<@"+user+"> adlı kişinin **"+user.voice.channel.name+"** adlı ses kanalından çıkarıldı.")
        .setColor("RANDOM")
        user.voice.kick()
        message.channel.send(attımknk).then(message => { message.delete({ timeout : 5000 }) }).then(m => message.react(this.client.ok))
    }
}
    module.exports = Voicekick;