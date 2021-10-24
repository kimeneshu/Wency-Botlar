const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const notlar = require("../models/notlar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js")
const {table} = require('table');
class CezaNum extends Command { 
    constructor(client) {
        super(client, {
            name: "ceza-sayı",
            description: "Latency and API response times.",
            aliases: ["cezasayı", "cezasayi", "ceza-sayi"]
        });
    }

    async run(message, args, perm) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.jailAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
          let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
          if (!user) return this.client.yolla("Ceza sayılarına bakmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        await data.find({user: user.id}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            let filterArr = []
            res.map(x => filterArr.push(x.ceza))
            await notlar.findOne({user: user.id}, async (err, data) => {
            let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
            let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
            let jail = filterArr.filter(x => x == "Cezalı").length || 0
            let puan = await this.client.punishPoint(user.id)
let uyarı 
if(!data) uyarı = 0
if(data) uyarı = data.notlar.length
           
const embed = new Discord.MessageEmbed()
.setAuthor(user.user.tag, user.user.displayAvatarURL({dynamic: true}))
.setDescription("🚫 <@"+user.id+"> kişisinin sahip olduğu ceza sayıları aşağıda belirtilmiştir.\n\n**"+chatMute+"** Chat Mute, **"+voiceMute+"** Voice Mute, **"+jail+"** Cezalı ve **"+uyarı+"** Uyarı notu.")
.setFooter("Toplam Ceza Puanı: " + puan + "")
.setColor("RANDOM")
message.channel.send(embed)
})
      })
    }
}

module.exports = CezaNum;
