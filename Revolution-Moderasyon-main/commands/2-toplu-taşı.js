const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class TopluTaşı extends Command {
    constructor(client) {
        super(client, {
            name: "toplu-taşı",
            aliases: ["toplutaşı", "ttaşı"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.hasPermission("MANAGE_ROLES")) return;
        if(!message.member.voice.channel) return this.client.yolla("Toplu taşıma işlemi uygulamadan önce bir ses kanalına bağlı olmalısın !", message.author, message.channel)
        let channelone = message.guild.channels.cache.find(a => a.type === "voice" && a.id === args[0])
        let channeltwo = message.guild.channels.cache.find(a => a.type === "voice" && a.id === args[1])
        if(!channelone) return this.client.yolla("Toplu taşıma işlemini yapmak için lütfen argümanları düzgün yerleştir !", message.author, message.channel)
        if(!channeltwo) return this.client.yolla("Toplu taşıma işlemini yapmak için lütfen argümanları düzgün yerleştir !", message.author, message.channel)
        if(channelone.length < 1) return this.client.yolla("Taşımak istediğiniz kanalda hiç üye olmadığı için işlem iptal edildi.", message.author, message.channel)
        channelone.members.map(a => { 
            a.voice.setChannel(channeltwo.id)
        })
        await this.client.yolla(`**${message.member.voice.channel.name}** kanalındaki üyeler **${channeltwo.name}** kanalına taşındı`, message.author, message.channel)
        message.react(this.client.ok)
    }
}

module.exports = TopluTaşı;
