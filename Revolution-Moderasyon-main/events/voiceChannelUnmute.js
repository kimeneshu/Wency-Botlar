const Discord = require("discord.js");
const mutedUser = require("../models/voicemute.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(member , muteType) {
        await member.guild.fetchAuditLogs({type: "MEMBER_MUTE_UPDATE"}).then(async (audit) => {
            let ayar = audit.entries.first()
            let yapan = ayar.executor
            let sunucu = member.guild
            if (yapan.id == this.client.user.id) return;
            if(this.client.config.member.guildOwners.includes(yapan.id)) return
            mutedUser.findOne({user: member.id}, async (err, doc) => {
                if (!doc) return
                if (doc.muted == true) {
                    if (muteType == "server-muted") {
                        const embed = new Discord.MessageEmbed()
                        .setAuthor(yapan.tag, yapan.displayAvatarURL({dynamic: true}))
                        .setDescription(`${this.client.no} ${member} adlı kullanıcının sesli susturulma süresi bitmeden cezası kaldırıldı.\n\n• Susturmayı açan yetkili: ${yapan} (\`${yapan.tag}\` - \`${yapan.id}\`)\n\n• Üyeye ceza-i işlem uygulayan yetkili <@${doc.yetkili}> - (\`${doc.yetkili}\`)`)
                        .setThumbnail(yapan.displayAvatarURL({dynamic: true}))
                        .setFooter("Susturmanın bitişine kalan süre: "+moment(doc.endDate).format("h:mm:ss")+"")
                        this.client.channels.cache.get(this.client.config.channels.removePunishment).send(embed)
                        if (member.voice.setMute(true)) {
                            member.voice.setMute(true)
                            yapan.send(`${member} adlı kullanıcının sesli susturma süresi bitmeden susturmasını açtığınız için tekrardan susturuldu. Lütfen ceza-i işlem süreleri bitmeden açmayınız.`)
                        }
                    }       
                }
            })
        })
    }
};