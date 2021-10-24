const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")
const ceza = require("../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
const sunucu = require("../models/sunucu-bilgi")
class Cezalı extends Command {
    constructor(client) {
        super(client, {
            name: "cezalı",
            aliases: ["jail"]
        });
    }

    async run(message, args, level) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.jailAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Cezalıya atmak istediğin kullanıcı geçerli değil.", message.author, message.channel)
        if (!args.slice(1).join(" ")) return this.client.yolla("Sebep belirtmeden cezalı işlemi uygulayamazsın.", message.author, message.channel)
        if(message.guild.members.cache.has(user.id)) {
        let member = message.guild.members.cache.get(user.id)
        if (member.roles.cache.has(this.client.config.roles.botCommandRole)) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).hasPermission("MANAGE_ROLES")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        }
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        let id = await sunucu.findOne({ guild: this.client.config.guildID }).then(res => res.ihlal)
        let banNum = this.client.jailLimit.get(message.author.id) || 0
        this.client.jailLimit.set(message.author.id, banNum + 1)
        if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla jail işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        if (!message.guild.members.cache.has(user.id)) {
            const embedx = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${user.tag} kullanıcısı sunucuda bulunmamasına rağmen cezalıya atıldı. Sunucuya girişi engellendi. (Ceza Numarası: \`#${id + 1}\`)`)
            message.channel.send(embedx)
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        } else {
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                let member = message.guild.members.cache.get(user.id)
                let memberRoles = member.roles.cache.map(x => x.id)
                let sonrakii = id + 1
                member.roles.set(member.roles.cache.has(this.client.config.roles.boosterRole) ? [this.client.config.roles.boosterRole, this.client.config.roles.karantinaRole] : [this.client.config.roles.karantinaRole]).catch(e => console.log(e))
                this.client.yolla("<@" + user + "> üyesine <@&852194278334660638> rolü verildi. (Ceza Numarası: `#" + sonrakii + "`)", message.author, message.channel)
                const başe = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setDescription(`${user} üyesine __${args.slice(1).join(" ")}__ sebebi ile <@&852194278334660638> rolü verildi.`)
                    .setFooter(`${moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")}`)
                await this.client.channels.cache.get(this.client.config.channels.jailLogs).send(başe)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        }


    }
}

module.exports = Cezalı;
