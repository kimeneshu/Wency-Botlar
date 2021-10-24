const Command = require("../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../models/kayıtlar.js")

class topteyit extends Command {
    constructor(client) {
        super(client, {
            name: "topteyit",
            description: "Latency and API response times.",
            usage: "erkek",
            aliases: ["topteyit"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.some(r => this.client.config.roles.registerAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let arr = []
        await kayıtlar.find({}, async (err, res) => {
            res.filter(x => message.guild.members.cache.has(x.user)).map(async (x) => {
                await arr.push({ user: x.user, kayıt: x.kayıtlar.length, erkek: x.erkek, kadın: x.kadın })
            })
        })
        let toplam = arr.map(x => x.kayıt).reduce((a, b) => a + b, 0)
        let kayıt = arr.sort((a, b) => b.kayıt - a.kayıt, 0).slice(0, 20)
        let num = 1
        let find = arr.find(x => x.user === message.author.id)
        let bişi = kayıt.map(x => `\`${num++}.\` <@${x.user}>: \`${x.kayıt} Kayıt.\`${x.user === message.author.id ? "**(Siz)** " : ""}`).join("\n")
        let embed1 = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Top 20 kayıt sıralaması aşağıda belirtilmiştir.\nBu hafta toplam \`${toplam}\` kayıt işlemi yapıldı.\n\n${bişi}\n\n${find ? `Siz ${arr.indexOf(find) + 1}. sırada bulunuyorsunuz.Toplam ${find.erkek} erkek, ${find.kadın} kadın kaydetmişsiniz.` : "Hiç kayıt bilginiz yok."}`)
            .setColor("RANDOM")
        await message.channel.send(embed1)
    }
}

module.exports = topteyit;
