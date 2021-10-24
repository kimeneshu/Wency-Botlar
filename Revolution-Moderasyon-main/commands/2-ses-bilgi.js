const Command = require("../base/Command.js");
const Discord = require("discord.js")

class Sesbilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ses",
            aliases: ["n", "nerde", "nerede"]
        });
    }

    async run(message, args, data) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.moveAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Ses bilgisine bakmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene!", message.author, message.channel)
        if (!user.voice.channel) return this.client.yolla("<@" + user.id + "> bir ses kanalına bağlı değil.", message.author, message.channel)
        let mic = user.voice.selfMute == true ? "kapalı" : "açık"
        let hop = user.voice.selfDeaf == true ? "kapalı" : "açık"
        let txt = ""
        if(this.client.channelTime.has(user.id)) {
            let süresi = this.client.channelTime.get(user.id) 
            txt += "Kullanıcı **"+ user.voice.channel.name +"** kanalına "+await this.client.turkishDate(Date.now() - süresi.time)+" önce giriş yapmış."
        } else {
            txt += "Kullanıcının ses süresi bilgisi yok." 
        }
        await this.client.yolla("<@" + user.id + "> kişisi <#" + user.voice.channel.id + ">* kanalında. Mikrofonu " + mic + " | Kulaklığı " + hop + ".\n───────────────\n"+txt+"", message.author, message.channel)

    };
}
module.exports = Sesbilgi;
