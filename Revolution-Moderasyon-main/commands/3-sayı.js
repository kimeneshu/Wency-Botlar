const Command = require("../base/Command.js");
const Discord = require("discord.js");
const notlar = require("../models/notlar.js");
const { max } = require("moment");
class Sayı extends Command {
    constructor(client) {
        super(client, {
            name: "Sayı",
            aliases: ["sayı", "names"]
        });
    }
    async run(message, args, data) {
        if(!this.client.config.member.guildOwners.includes(message.author.id)) return
        let includes = args[0]
        if (!includes) return this.client.yolla("Lütfen bir kelime belirtip tekrar deneyin!", message.author, message.channel)
        const includesFilter = (reaction, user) => {
            return ["👌"].includes(reaction.emoji.name) && user.id === message.author.id
        }
        if (message.guild.members.cache.filter(x => x.user.username.includes(includes)).size === 0) return this.client.yolla("Kullanıcıların adında belirttiğiniz (`"+includes+"`) kelimesinden bulunamadı!", message.author, message.channel)
        if (message.guild.members.cache.filter(x => x.user.username.includes(includes)).size > 500) return this.client.yolla("Kullanıcı adında `"+includes+"` bulunan kişi sayısı 500 ü geçtiği için gönderemiyorum.", message.author, message.channel)
        message.channel.send(`Kullanıcı adında \`${includes}\` kelimesi geçen toplamda ${message.guild.members.cache.filter(x => x.user.username.includes(includes)).size} kadar kişi bulunmakta. Tüm üyeleri görüntülemek istiyorsanız 👌 emojisine tıklayınız.\n\nTepkisizlik dahilinde işlem 30 saniye içerisinde iptal edilecektir.`).then(m => m.react("👌").then(r => m.awaitReactions(includesFilter, {
            max: 1, time: 30000, errors: ["time"]
        })).then(collected => {
            const reaction = collected.first()
            if (reaction.emoji.name === "👌") {
                let includesOne = 1
                m.reactions.removeAll() && m.edit(`Kullanıcı adında \`${includes}\` geçen kullanıcılar alt tarafta gösteriliyor.\n─────────────────`)
                const throwns = `${this.client.users.cache.filter(x => x.tag.toLowerCase().includes(includes.toLowerCase())).map(x => `**${includesOne++}.** <@${x.id}> - (\`${x.id}\`)`).join("\n")}`
                message.channel.send(throwns, { split: true})
            }
        })
        )
    }
}
    module.exports = Sayı;
