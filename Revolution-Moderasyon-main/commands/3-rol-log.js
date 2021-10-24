const Command = require("../base/Command.js");
const Discord = require("discord.js")
const roller = require("../models/rollog.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class Rollog2 extends Command {
    constructor(client) {
        super(client, {
            name: "rollog",
            usage: "",
            aliases: ["rol-log", "rollogs", "rol-logs"]
        });
    }

    async run(message, args, level) {
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Veri = await roller.findOne({ user: Member.id });
        if (!Veri) return this.client.yolla("<@" + Member.id + "> kişisinin rol bilgisi veritabanında bulunmadı.", message.author, message.channel)
        let page = 1;
        let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
        let liste = rol.map(x => `${x.state == "Ekleme" ? this.client.ok : this.client.no} Rol: <@&${x.rol}> Yetkili: <@${x.mod}>\nTarih: ${moment(x.tarih).format("LLL")}`)
        var msg = await message.channel.send(new Discord.MessageEmbed().setDescription(`${Member} kişisinin toplamda ${Veri.roller.length} rol bilgisi bulunmakta, rollerin bilgileri aşağıda belirtilmiştir.\n\n ${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n─────────────────\n')}`).setColor("RANDOM").setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`));
        if (liste.length > 10) {
            await msg.react(`⬅️`);
            await msg.react(`➡️`);
            let collector = msg.createReactionCollector((react, user) => ["⬅️", "➡️"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });
            collector.on("collect", (react) => {
                if (react.emoji.name == "➡️") {
                    if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n─────────────────\n");
                    msg.edit(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${Member} kişisinin toplamda ${Veri.roller.length} rol bilgisi bulunmakta, rollerin bilgileri aşağıda belirtilmiştir.\n\n${rollogVeri}`).setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`));
                    react.users.remove(message.author.id)
                }
                if (react.emoji.name == "⬅️") {
                    if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n─────────────────\n");
                    msg.edit(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${Member} kişisinin toplamda ${Veri.roller.length} rol bilgisi bulunmakta, rollerin bilgileri aşağıda belirtilmiştir.\n\n${rollogVeri}`).setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`));
                    react.users.remove(message.author.id)
                }
            })
        }
    }
}
module.exports = Rollog2;
