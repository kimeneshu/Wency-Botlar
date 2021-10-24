const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")

class RolDenetim extends Command {
    constructor(client) {
        super(client, {
            name: "roldenetim",
            aliases: ["rol-denetim", "rol-say"]
        });
    }


    async run(message, args, level) {
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let roles = args.length > 0 ? message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) : message.guild.roles.cache.find(x => x.id == this.client.config.roles.botCommandRole)
            let offlineMembers = message.guild.members.cache.filter(x => {
                return x.roles.cache.has(roles.id) && !x.voice.channel && x.user.presence.status == "offline"
            })
            let voiceMembers = message.guild.members.cache.filter(x => {
                return x.roles.cache.has(roles.id) && x.voice.channel
            })
            let notVoiceMembers = message.guild.members.cache.filter(x => {
                return x.roles.cache.has(roles.id) && !x.voice.channel
            })
            message.channel.send("```Roldeki Offline Kullanıcılar("+ offlineMembers.size +"):\n```" + offlineMembers.map(x => "<@" + x.id + ">").join(",") + "")
            message.channel.send("```Roldeki Seste Olan Kullanıcılar("+ voiceMembers.size +"):\n```" + voiceMembers.map(x => "<@" + x.id + ">").join(",") + "")
            message.channel.send("```Roldeki Seste Olmayan Kullanıcılar("+ notVoiceMembers.size +"):\n```" + notVoiceMembers.map(x => "<@" + x.id + ">").join(",") + "")
        }
}

module.exports = RolDenetim
