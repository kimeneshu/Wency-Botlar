    const Command = require("../base/Command.js");
    const data = require("../models/cezalar.js")
    const ms = require("ms")
    const moment = require("moment")
    require("moment-duration-format")
    const Discord = require("discord.js")
    moment.locale("tr")
    const tokuchi = require("pretty-ms");
    const mutes = require("../models/voicemute.js")
    const sunucu = require("../models/sunucu-bilgi.js")
    const wmute = require("../models/waitMute.js")
    class Unmute extends Command {
        constructor(client) {
            super(client, {
                name: "unmute",
                aliases: ["unmute"]
            });
        }

        async run(message, args, perm) {
            if (!message.member.roles.cache.some(r => this.client.config.roles.unmuteAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
            let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
            if(message.author.id == user.id) return this.client.yolla("Kendi susturmanı kendin açamazsın.", message.author, message.channel)
            if (!user) return this.client.yolla("Ses / Chat mutesini kaldırmak istediğiniz kullanıcıyı belirtmeniz gerekmektedir.", message.author, message.channel)
            message.react(this.client.ok)
            if (user.voice.serverMute == true) {
                user.voice.setMute(false)
                this.client.yolla("<@" + user + "> adlı kullanıcının sesli susturması kaldırılmıştır.", message.author, message.channel)
                message.react(this.client.ok)
            } else {
                message.react(this.client.ok)
            }
            if (user.roles.cache.has(this.client.config.roles.chatMutedRole)) {
                user.roles.remove(this.client.config.roles.chatMutedRole)
                this.client.yolla("<@" + user + "> adlı kullanıcının metin kanallarında ki susturulması kaldırılmıştır.", message.author, message.channel)
                message.react(this.client.ok)
            }

        }
    }

    module.exports = Unmute;
