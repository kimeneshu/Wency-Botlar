const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js")
const tokuchi = require("pretty-ms");
const mutes = require("../models/chatmute.js")
const sunucu = require("../models/sunucu-bilgi.js")
const bitmiyor = require("parse-ms")
class Mute extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            aliases: ["mute"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.some(r => this.client.config.roles.chatMuteAtuh.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Susturmak istediğin kullanıcıyı bulamadım.", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Susturma süresini belirtmelisin.", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Belirtilen susturma süresi geçerli değil.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Susturma sebebini belirtmelisin.", message.author, message.channel)
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)

        if (!message.member.roles.cache.get("866405700019421204") && !message.member.roles.cache.get("866405980550987786") && !message.member.roles.cache.get("852194278406357000")) {
            if (user.hasPermission("MANAGE_ROLES")) return this.client.yolla("Yöneticilere ceza-i işlem uygulayamazsın.", message.author, message.channel)
            if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
            if (user.roles.cache.has(this.client.config.roles.botCommandRole)) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        }
        if (user.roles.cache.has(this.client.config.roles.chatMutedRole)) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
        let time = ms(args[1]);
        let muteTime = time
        let dataTime = await this.client.extraMute(user.id, "chatMute", time).then(res => res.ihlal)
        muteTime = muteTime + (muteTime * dataTime)
        let cıkaralım = time + Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }));
        let şuanki = moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL");
        let sonraki = moment(cıkaralım).format("LLL");
        let id = await sunucu.findOne({ guild: this.client.config.guildID }).then(res => res.ihlal)
        user.roles.add(this.client.config.roles.chatMutedRole)
        await message.channel.send(`${this.client.muted} <@${user.id}> kişisi ${await this.client.turkishDate(time)} ${ms(args[1]) < muteTime ? `(\`kullanıcı daha önceden cezalı olduğu için cezasına +${await this.client.turkishDate(muteTime - time)} eklendi.\`) ` : ``}boyunca metin kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendı = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("32CD32")
            .setFooter(`Ceza Numarası: #${id + 1}`)
            .setDescription(`${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca metin kanallarında susturuldu\n\n• Susturulma sebebi: \`${args.slice(2).join(" ")}\`\n• Chat Mute atılma tarihi: \`${şuanki}\`\n• Chat Mute bitiş tarihi: \`${sonraki}\``)
        await this.client.channels.cache.get(this.client.config.channels.chatMuteLogs).send(mutelendı)
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + ms(args[1]),
                start: Date.now(),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Chat Mute",
                sebep: args.slice(2).join(" "),
                tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                bitiş: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" })) + ms(args[1])).format("LLL")
            })
            newData.save().catch(e => console.error(e))
            this.client.savePunishment()
        })
    }
}

module.exports = Mute;
