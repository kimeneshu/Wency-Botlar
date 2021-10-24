const Command = require("../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../models/cantUnBan.js")
class NoUNBANRemove extends Command {
    constructor(client) {
        super(client, {
            name: "açılmazbanaç",
            aliases: ["açılmazban-kaldır", "açılmazbanaç"]
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
                        embed.setDescription(`\`${res.tag}\` isimli üye bu sunucudan yasaklı değil.!`)
                        return message.channel.send(embed)
                    } else {
                        await db.findOne({ user: res.id }, async (err, doc) => {
                            if (!doc) {
                                embed.setDescription(`**${res.tag}** kullanıcısının yasağı zaten kalıcı olarak işaretlenmemiş.`)
                                return message.channel.send(embed)
                            } else {
                                embed.setDescription(`Bu komutu kullanmak için yeterli yetkilere sahip değilsin.`)
                                doc.delete().catch(e => console.log(e))
                                embed.setDescription(`**${res.tag}** kullanıcısının açılmaz ban etiketi kaldırıldı.`)
                                message.react(''+this.client.ok+'')
                            }
                        })
                    }
                })
            }
        }).catch(err => {
            embed.setDescription("Geçerli bir kullanıcı ID si giriniz.")
            return message.channel.send(embed)
        })
    }
}



module.exports = NoUNBANRemove;