const Command = require("../base/Command.js");
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js");
const db = require("../models/vrcRoleCommands")
class cmdKomut extends Command {
    constructor(client) {
        super(client, {
            name: "komut",
            aliases: ["cmd"]
        });
    }

    async run(message, args, perm) {
        if(!this.client.config.botOwners.includes(message.author.id)) return
        let arr = ["ekle", "izin", "sil", "engelle", "ekle", "kaldır", "bilgi"]
        if (!arr.includes(args[0])) return this.client.yolla("Argümanları doğru şekilde yerleştirip tekrar deneyin;\n\`!komut ekle <isim> @rol\`", message.author, message.channel)
        if (args[0] === "ekle") {
            let res = await db.findOne({ cmdName: args[1] })
            if (res) return message.channel.send(`\`${args[1]}\` adında bir komut zaten mevcut.`)

            let role = message.mentions.roles.first() || await message.guild.roles.cache.get(args[2])
            if (!role) return message.channel.send(`\`${args[1]}\` komutuna atamak için geçerli bir rol belirtin.\n\`.komut ekle <isim> @rol\``)

            let buffer = new db({
                cmdName: args[1],
                allowedRoles: [],
                role: role.id,
                blockedUsers: [],
                allowedUsers: []
            })

            return buffer.save().then(() => {
                message.channel.send(`\`${args[1]}\` adlı bir komut oluşturuldu. Bu komutu kullananlara \`${role.name}\` rolü verilecek.`)
            })
        }

        if (args[0] === "izin") {
            let newArr = ["ekle", "kaldır", "kaldir", "ver"]
            if (!newArr.includes(args[1])) return this.client.yolla("Argümanları doğru şekilde yerleştirip tekrar deneyin;\n\`!komut izin ekle/kaldır <isim> @rol\`", message.author, message.channel)

            let res = await db.findOne({ cmdName: args[2] })
            if (!res) return message.channel.send(`\`${args[2]}\` adında bir komut bulunamadı.`)

            let role = message.mentions.roles.first() || await message.guild.roles.cache.get(args[3])
            let user = message.mentions.members.first() || await message.guild.members.cache.get(args[3])
            if (!role && !user) return message.channel.send(`\`${args[2]}\` komutuna atamak için geçerli bir üye ya da rol belirtin.\n\`.komut izin ekle/kaldır <isim> @rol\``)
            if (!user && role && role.id === res.role) return message.channel.send(`Komutta verilecek rol, izni tanınan rolden farklı olmalıdır.`)

            if (!user && role) {
                if (args[1] === "ekle" || args[1] === "ver") {
                    if (res.allowedRoles.includes(role.id)) return message.channel.send(`${role.name} rolünün zaten \`${args[2]}\` komutunu kullanma izni var.`)
                    res.allowedRoles.push(role.id)
                    return res.save().then(() => {
                        message.channel.send(`${role.name} rolündeki üyeler artık \`${args[2]}\` komutunu kullanabilecek.`)
                    })
                } else {
                    if (!res.allowedRoles.includes(role.id)) return message.channel.send(`${role.name} rolünün zaten \`${args[2]}\` komutunu kullanma izni yok.`)
                    res.allowedRoles.splice(res.allowedRoles.indexOf(role.id), 1)
                    return res.save().then(() => {
                        message.channel.send(`${role.name} rolündeki üyelerin \`${args[2]}\` komutunu kullanma izni kaldırıldı.`)
                    })
                }
            }

            if (!role && user) {
                if (args[1] === "ekle" || args[1] === "ver") {
                    if (res.allowedRoles.includes(user.id)) return message.channel.send(`${user} kişisinin zaten \`${args[2]}\` komutunu kullanma izni var.`)
                    res.allowedUsers.push(user.id)
                    return res.save().then(() => {
                        message.channel.send(`${user} artık \`${args[2]}\` komutunu kullanabilecek.`)
                    })
                } else {
                    if (!res.allowedUsers.includes(user.id)) return message.channel.send(`${user} kişisinin zaten \`${args[2]}\` komutunu kullanma izni yok.`)
                    res.allowedUsers.splice(res.allowedUsers.indexOf(user.id), 1)
                    return res.save().then(() => {
                        message.channel.send(`${user} kişisinin \`${args[2]}\` komutunu kullanma izni kaldırıldı.`)
                    })
                }
            }

        }

        if (args[0] === "sil" || args[0] === "kaldır" || args[0] === "kaldir") {
            let res = await db.findOne({ cmdName: args[1] })
            if (!res) return message.channel.send(`\`${args[1]}\` adında bir komut bulunamadı.`)

            return res.delete().then(() => {
                message.channel.send(`\`${args[1]}\` komutu silindi.`)
            })
        }

        if (args[0] === "bilgi") {
            let res = await db.findOne({ cmdName: args[1] })
            if (!res) return message.channel.send(`\`${args[1]}\` adında bir komut bulunamadı.`)

            let embed = new Discord.MessageEmbed()
            embed.setColor("RANDOM")
            embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            embed.setDescription(`Komut Adı: \`${res.cmdName}\`\nVerilecek Rol: <@&${res.role}>\n\nİzinli Roller: <@&852194278519603211>  ${res.allowedRoles.map(x => `<@&${x}>`).join("  ")}\nİzinli Kullanıcılar: ${res.allowedUsers.map(x => `<@${x}>`).join("  ")}\nEngellenen Kullanıcılar: ${res.blockedUsers.map(x => `<@${x}>`).join("  ") || "Yok"}`)
            return message.channel.send({ embed: embed })
        }

        if (args[0] === "engelle") {
            let res = await db.findOne({ cmdName: args[1] })
            if (!res) return message.channel.send(`\`${args[1]}\` adında bir komut bulunamadı.`)

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[2])
            if (!member) return message.channel.send(`\`${args[1]}\` komutundan engellemek için bir üye belirtin.\n\`.komut engelle <isim> @üye\``)

            if (res.blockedUsers.includes(member.user.id)) {
                await res.blockedUsers.splice(res.blockedUsers.indexOf(member.user.id), 1)
                await res.save()
                return message.channel.send(`<@${member.user.id}> üyesinin \`${args[1]}\` komutunu kullanım engeli kalktı.`)
            } else {
                await res.blockedUsers.push(member.user.id)
                await res.save()
                return message.channel.send(`<@${member.user.id}> üyesi \`${args[1]}\` komutunun kullanımından engellendi.`)
            }
        }


    }
}

module.exports = cmdKomut;