const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Move extends Command {
    constructor(client) {
        super(client, {
            name: "move",
            aliases: ["ycek", "yçek", "çek", "cek"]
        });
    }
    async run(message, args, perm) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.moveAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!message.member.voice.channel) return this.client.yolla("Bir kullanıcıyı sese çekmek için ilk önce senin ses kanallarında bulunmak gerekiyor!", message.author, message.channel)
        if(!user) return this.client.yolla("Bir kullanıcıyı sese çekmek istiyorsan o kullanıcıyı belirtmen gerekir.", message.author, message.channel)
        if(!user.voice.channel) return this.client.yolla("Etiketlediğin kullanıcı her hangi sesli bir kanalda bulunmuyor.", message.author, message.channel)
        if(!message.member.voice.channel === user.voice.channel) return this.client.yolla("Etiketlediğiniz kullanıcı ile aynı sesli kanalda bulunuyorsunuz.", message.author, message.channel)
        if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return this.client.yolla("Rolleri senden üst ve ya aynı olan kullanıcıları ses odalarında taşıyamazsın.", message.author, message.channel)
        message.guild.members.cache.get(user.id).voice.setChannel(message.member.voice.channel)
        const başarılı = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription("<@"+user+"> kişisini başarıyla **"+message.member.voice.channel.name+"** adlı ses kanalına çektiniz.")
        .setColor("RANDOM")
        message.channel.send(başarılı).then(message => { message.delete({ timeout: 5000 }) }).then(m => message.react(this.client.ok))
        }
}

module.exports = Move;