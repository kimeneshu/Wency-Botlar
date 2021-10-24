const Command = require("../base/Command.js");
const Discord = require("discord.js")
const Database = require('../models/inviter.js');
class Leaderboard extends Command {
    constructor(client) {
        super(client, {
            name: "leaderboard",
            aliases: ["top-invites", "top-inv"]
        });
    }

    async run(message, args, data) {
       await Database.find({}, async(err, res) => {
        // if (!res) return this.client.yolla(`${message.guild.name} adlı sunucunun davet verisi yok!`, message.author, message.channel)
            let list = res.map(x => ({
            doc: x,
            num: x.bonus + x.regular,
            regulary: x.regular, 
            bonusy: x.bonus,
            fakes: x.fake,
            leaves: x.leave
            })).sort((a,b) => b.num - a.num).slice(0,10)
            let text = list.map(x => `\`${list.indexOf(x) + 1}.\` <@${x.doc.userid}>: **${x.num}** davete sahip. (**${x.regulary}** Normal, **${x.fakes}** Sahte, **${x.leaves}**, Ayrılma, **${x.bonusy}** Bonus)`).join("\n");
            let mavish = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(text)
            .setColor("RANDOM")
            await message.channel.send(mavish)
         })
     }
}

module.exports = Leaderboard;