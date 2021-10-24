const Command = require("../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../models/cantUnBan.js")
class NoUNBAN extends Command {
    constructor(client) {
        super(client, {
            name: "infaz",
            aliases: ["açılmazban", "infaz"]
        });
    }

    async run(message, args, client) {
        if(!this.client.config.member.guildOwners.includes(message.author.id)) return
        let embed = new Discord.MessageEmbed()
        embed.setColor("RANDOM")
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))

        await this.client.users.fetch(args[0]).then(res => {
            if (!res) {
                embed.setDescription("Lütfen geçerli bir kullanıcı ID'si giriniz.")
                return message.channel.send(embed)
            } else {
                message.guild.fetchBans(true).then(async (bans) => {
                    let ban = await bans.find(a => a.user.id === res.id)
                    if (!ban) {
                        embed.setDescription(`\`${res.tag}\` isimli üye bu sunucudan yasaklı değil.`)
                        return message.channel.send(embed)
                    } else {
                        await db.findOne({ user: res.id }, async (err, doc) => {
                            if (doc) {
                                embed.setDescription(`**${res.tag}** kullanıcısı zaten <@${doc.mod}> yetkilisi tarafından kalıcı olarak yasaklandı.`)
                                return message.channel.send(embed)
                            } else {
                                message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                                    let user = audit.entries.find(a => a.target.id === res.id)
                                    if(user && user.executor.id !== message.author.id) return
                                    if(!user) return this.client.yolla(`Bu üye son 100 yasaklama içinde bulunamıyor.`, message.author, message.channel)
                                })
                                const newBanData = new db({
                                    user: res.id,
                                    mod: message.author.id,
                                    sebep: ban.reason || "Sebep Belirtilmedi."
                                })
                                newBanData.save().catch(e => console.log(e))
                            }
                            embed.setDescription(`**${res.tag}** kullanıcısının yasağı açılamaz olarak işaretlendi.`)
                            message.channel.send(embed)
                            message.react(''+this.client.ok+'')
                        })
                    }
                })
            }
        }).catch(err => {
            embed.setDescription("Lütfen geçerli bir kullanıcı ID'si giriniz.")
            return message.channel.send(embed)
        })
    }
}

module.exports = NoUNBAN;