const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")

class Yetkilisay extends Command {
    constructor(client) {
        super(client, {
            name: "yetkilisay",
            aliases: ["ysay", "yetkili-say"]
        });
    }


    async run(message, args, level) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.authySayRole.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
            let roles = args.length > 0 ? message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) : message.guild.roles.cache.find(x => x.id == this.client.config.roles.botCommandRole)
            let üyeler = message.guild.members.cache.filter(x => {
                return x.roles.cache.has(roles.id) && !x.voice.channel && x.user.presence.status !== "offline"
            })
            // if(roles.position < 96) return message.channel.send("Sadece yetkili rolleri ve üstünün bilgisini verebilirim.")
            message.channel.send("Online olup seste olmayan \`\`"+roles.name+"\`\` rolündeki yetkili sayısı: " + üyeler.size + "")
            if(üyeler.size == 0) return
            message.channel.send("" + üyeler.map(x => "<@" + x.id + ">").join("\n") + "", { code: "js", split: true })
    }
}

module.exports = Yetkilisay
