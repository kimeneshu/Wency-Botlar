const Command = require("../base/Command.js");
const Discord = require("discord.js")
const datax = require('../models/inviter.js');
class Rank extends Command {
    constructor(client) {
        super(client, {
            name: "davet",
            aliases: ["invites", "rank", "davetlerim"]
        });
    }
    async run(message, args, data) {
        let tokaci = args.length > 0 ? message.mentions.users.first() || await this.client.client_üye(args[0]) || message.author : message.author
        await datax.findOne({userid: tokaci.id}, async(err, res) => {
            if(!res) {
                this.client.yolla(`${tokaci} üyesinin davet verisi bulunamadı!`, message.author, message.channel)
            } else {
                let toplam = res.regular + res.fake + res.bonus
                this.client.yolla(`${tokaci} toplam **${toplam}** daveti var. (**${res.regular}** normal, **${res.fake}** sahte, **${res.leave}** ayrılan, **${res.bonus}** bonus)`, message.author, message.channel)
            }
        })
    }
}

module.exports = Rank;