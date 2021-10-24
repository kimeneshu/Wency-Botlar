const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const tokuchi = require("pretty-ms");
const mutes = require("../models/chatmute.js")
const sunucu = require("../models/sunucu-bilgi.js")
const bitmiyor = require("parse-ms")
class Kur extends Command {
    constructor(client) {
        super(client, {
            name: "Kur",
            aliases: ["kur"]
        });
    }
    async run(message, args, perm) {
        if(!this.client.config.botOwners.includes(message.author.id)) return
        sunucu.findOne({guild: message.guild.id }, async (err, doc) => {
            if(!doc){const newData = new sunucu({
            guild: message.guild.id,
            ihlal: 0
            })
            newData.save().catch(e => console.log(e))}
        if(doc) return
        })
        message.channel.send(`${this.client.ok} Sunucu ceza kurulumu başarıyla tamamlanmıştır kullanıma hazır hale geldim.`)
    }
}
  module.exports = Kur;