const Command = require("../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../models/kayıtlar.js")

class Kayıt extends Command {
    constructor(client) {
        super(client, {
            name: "kayıt-bilgi",
            description: "Latency and API response times.",
            usage: "erkek",
            aliases: ["kayıtbilgi", "kayıtlar"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.some(r => this.client.config.roles.registerAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild) || message.member
        await kayıtlar.findOne({ user: user.id }, async (err, res) => {
            if (!res) return this.client.yolla("<@" + user.id + "> kişisinin hiç kayıt bilgisi yok.", message.author, message.channel)
            let üyeler = await this.client.shuffle(res.kayıtlar.map(x => "<@" + x + ">"))
            if (üyeler.length > 10) üyeler.length = 10
            this.client.yolla("<@" + user.id + "> kişisi toplam " + res.toplam + " kayıt (**" + res.erkek + "** erkek, **" + res.kadın + "** kadın) uygulamış.\nKaydettiği bazı kişiler: " + üyeler.join(",") + " ", user.user, message.channel)
        })
    }
}

module.exports = Kayıt;
