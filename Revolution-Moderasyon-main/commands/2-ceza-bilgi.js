const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const mutes = require("../models/chatmute.js")
const vmutes = require("../models/voicemute.js")
const cezalar = require("../models/cezalı.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js")
class İnfo extends Command {
    constructor(client) {
        super(client, {
            name: "info",
            aliases: ["cezainfo", "ceza-bilgi", "ceza-info", "bilgi-ceza"]
        });
    }
    async run(message, args, perm) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.jailAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args.join(" "), message.guild) || await this.client.client_üye(args.join(" "))
        if (!user) return this.client.yolla("Ceza bilgisine bakmak istediğin kullanıcıyı bulamadım.", message.author, message.channel)
        if(!message.guild.members.cache.has(user.id)) return this.client.yolla("Ceza bilgisine bakmak istediğin kullanıcı sunucuda bulunmuyor.", message.author, message.channel)
        let mute = ""
        let vmute = ""
        let cezalı = ""
        await cezalar.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) {
                cezalı = "Veritabanında cezalı bilgisi bulunmamakta."
            } else {
                if (doc.ceza == false) {
                    cezalı = "Veritabanında chat mute bilgisi bulunmamakta."
                } else if (doc.ceza == true) {
                    cezalı = "Cezalı Atan Yetkili: <@" + doc.yetkili + ">\nCeza Sebebi: `" + doc.sebep + "`\nCeza Tarihi: `" + doc.tarih + "`\nCeza Bitiş: `Bilinmiyor.` "
                }
            }
        })
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) {
                mute = "Veritabanında chat mute bilgisi bulunmamakta."
            } else {
                if (doc.muted == false) {
                    mute = "Veritabanında chat mute bilgisi bulunmamakta."
                } else if (doc.muted == true) {
                    mute = "Mute Atan Yetkili: <@" + doc.yetkili + ">\nMute Sebebi: `" + doc.sebep + "`\nMute Başlangıç: `" + moment(doc.start).format("LLL") + "`\nMute Bitiş: `" + moment(doc.endDate).format("LLL") + "` "
                }
            }
        })
        await vmutes.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) {
                vmute = "Veritabanında ses mute bilgisi bulunmamakta."
            } else {
                if (doc.muted == false) {
                    vmute = "Veritabanında aktif voice mute bilgisi bulunmamakta."
                } else if (doc.muted == true) {
                    vmute = "Mute Atan Yetkili: <@" + doc.yetkili + ">\nMute Sebebi: `" + doc.sebep + "`\nMute Başlangıç: `" + moment(doc.start).format("LLL") + "`\nMute Bitiş: `" + moment(doc.endDate).format("LLL") + "` "
                }
            }
        })
        let uu = this.client.users.cache.get(user.id)
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription("<@" + user.id + "> kişisinin ceza bilgileri aşağıda belirtilmiştir.")
            .setThumbnail(uu.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '❯ Cezalı Bilgisi', value: cezalı || "Veritabanında cezalı bilgisi bulunmamakta." },
                { name: '❯ Chat Mute Bilgisi:', value: mute || "Veritabanında chat mute bilgisi bulunmamakta.", inline: false },
                { name: '❯ Ses Mute Bilgisi:', value: vmute || "Veritabanında ses mute bilgisi bulunmamakta.", inline: false },
            )
                await message.channel.send(embed)

    }
}

module.exports = İnfo;