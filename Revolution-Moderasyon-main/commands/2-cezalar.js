const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const {table} = require('table');
const Discord = require("discord.js");
class Ceza extends Command {
    constructor(client) {
        super(client, {
            name: "ceza",
            aliases: ["ihlal"]
        });
    }

    async run(message, args, perm) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.jailAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        if(!args[0]) return this.client.yolla("Kontrol etmek istediğin ceza numarasını girmelisin.", message.author, message.channel)
        await data.findOne({ihlal: args[0]}, async (err, res) => {
            if(!res) return this.client.yolla("Belirttiğin numaralı ceza bilgisi bulunamadı.", message.author, message.channel)
            let user = message.guild.members.cache.get(res.user)
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            //.setThumbnail(user.user.displayAvatarURL({dynamic:true}))
            .addFields(
                { name: '❯ Ceza Türü', value: res.ceza },
                { name: '❯ Ceza Atan Yetkili:', value: "<@"+res.yetkili+">", inline: false },
                { name: '❯ Ceza Sebebi:', value: res.sebep, inline: false },
                { name: '❯ Ceza Başlangıç:', value: res.tarih, inline: false },
                { name: '❯ Ceza Bitiş:', value: res.bitiş, inline: false },
            )
            .setColor("RANDOM")
            .setThumbnail(user.user.displayAvatarURL({dynamic: true, size: 2048}))
            .setDescription("<@"+res.user+"> kişisine uygulanan "+res.ihlal+" numaralı ceza bilgisi;")
            message.channel.send(embed)
    })
    }
}

module.exports = Ceza;