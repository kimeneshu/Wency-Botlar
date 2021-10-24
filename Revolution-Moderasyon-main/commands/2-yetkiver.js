const Command = require("../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
const cezalar = require("../models/cezalar.js")
const Discord = require("discord.js")
const data = require("../models/cezalar.js")
const sunucu = require("../models/sunucu-bilgi.js")
class Yetkiver extends Command {
    constructor(client) {
        super(client, {
            name: "yetkiver",
            aliases: ["yetkiver"]
        });
    }

    async run(message, args, perm) {
         if (!message.member.roles.cache.some(r => ["856589245074636812", "852194278519603213", "852194278519603211", "852194278507806777", "852194278507806779"].includes(r.id))) return;
        if (args.length < 1) return this.client.yolla("Bir kullanıcı etiketleyin veya kullanıcı ID giriniz.", message.author, message.channel)
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Belirttiğiniz kullanıcı geçerli değil.", message.author, message.channel)
        if(!user.user.username.includes("✬")) return this.client.yolla("Belirttiğiniz kullanıcı sunucu tagına sahip olmadığı için yetki verme işlemi uyguluyamazsın.", message.author, message.channel)
        let map = new Map([
            ["-moon", [this.client.config.moderatorRole.oneManageRole, this.client.config.roles.botCommandRole]],
            ["-rise", [this.client.config.moderatorRole.twoManageRole, this.client.config.roles.botCommandRole]],
            ["-yetkili", ["858824388819419158", "852194278461276213"]]
        ])
        let metin = ""
        let arr = []
        for (let [k, v] of map) {
            if (args[0] == k) return
            v.map(x => {
                arr.push(x)
            })
        }
        for (let [k, v] of map) {
            metin = metin + `\`${k}\` - ${v.map(x => `<@&${x}>`)}\n`
        }
        let values = args[1]
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription(`Belirttiğiniz rol geçerli değil lütfen aşağıdaki verilere göre komutu uygulayınız.\n\n${metin}\n\n\`Örnek kullanım:\n!yetkiver 310779453464772608 -aurora\n!yetkiver @Wéncy.#1984 -celeste\`\n`)
        if (!values) return message.channel.send(embed)
        if (!map.has(values.toLowerCase())) return message.channel.send(embed)
        const roller = map.get(values)
        await user.roles.add(roller)
        let arrx = arr.filter(function (item, pos) {
            return arr.indexOf(item) == pos;
        })
        arrx.map(async (x) => {
            if (user.roles.cache.has(x)) {
                if (roller.includes(x)) return
                await user.roles.remove(x)
            }
        })
        embed.setDescription(`${user} kullanıcısına <@&${roller[0]}> yetkisi verildi.`)
        message.channel.send(embed)
        this.client.channels.cache.get(this.client.config.channels.giveManageRoleLog).send(`[\`${moment(Date.now()).add(3,"hour").format("LLL")}\`] <@${message.author.id}> tarafından ${user} (\`${user.id}\`) kişisi <@&${roller[0]}> yetkisinden başlatıldı.`)
    }
}

module.exports = Yetkiver;
