const Command = require("../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Profil extends Command {
    constructor(client) {
        super(client, {
            name: "profil",
            aliases: ["profil"]
        });
    }

    async run(message, args, data) {
        if(!message.member.hasPermission("VIEW_AUDIT_LOG") && message.channel.id !== "kanalid") return
        let user = args.length > 0 ? message.mentions.users.first() || await this.client.client_üye(args[0]) || message.author : message.author
        const embed = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor("BLACK")
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("❯ Kullanıcı Bilgisi", "`•` Hesap: <@" + user.id + ">\n`•` Kullanıcı ID: " + user.id + "\n`•` Kuruluş Tarihi: " + moment(user.createdTimestamp).format("LLL") + " - (" + moment(user.createdTimestamp).fromNow() + ")", false)
        if (message.guild.members.cache.has(user.id)) {
            let member = message.guild.members.cache.get(user.id)
            let nickname = member.displayName == user.username ? "" + user.username + " [Yok] " : member.displayName
            const members = message.guild.members.cache.filter(x => !x.user.bot).array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
            const joinPos = members.map((u) => u.id).indexOf(member.id);
            const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
            const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
            const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
            const rolleri = []
            if (roles.length > 6) {
                const lent = roles.length - 6
                let itemler = roles.slice(0, 6)
                itemler.map(x => rolleri.push(x))
                rolleri.push(`${lent} daha...`)
            } else {
                roles.map(x => rolleri.push(x))
            }

            const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${user.id}>${next ? ` > **${next.tag}**` : ""}`
            embed.addField("❯ Sunucu Bilgisi", "`•` Sunucu İsmi: " + nickname + "\n`•` Katılım Tarihi: " + moment(member.joinedAt).format("LLL") + " - (" + moment(member.joinedAt).fromNow() + ")\n`•` Katılım Sırası: " + joinPos + "/" + message.guild.members.cache.size + "\n`•` Katılım Bilgisi: " + bilgi + "\n\n`•` Rolleri (" + roles.length + "): " + rolleri.join(", ") + " ", false)
            embed.setColor(member.displayHexColor)
        }
        message.channel.send(embed)
    }
}

module.exports = Profil;
