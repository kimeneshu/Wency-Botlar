let database = require("../models/voicemute.js")
const mutes = require("../models/waitMute.js")
const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
const ms = require("ms");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(member, channel) {
        if (member.user.bot) return;
        if(!this.client.channelTime.has(member.id)) {
        this.client.channelTime.set(member.id, {channel: channel.id, time: Date.now()})
        }
        await mutes.findOne({ user: member.id }, async (err, res) => {
            if (!res) return
            await database.findOne({ user: member.id }, async (err, doc) => {
                if (!doc) {
                    const newData = new database({
                        user: member.id,
                        muted: true,
                        yetkili: res.yetkili,
                        endDate: Date.now() + res.date,
                        start: Date.now(),
                        sebep: res.sebep
                    })
                    newData.save().catch(e => console.log(e))
                }
            })
            member.voice.setMute(true, res.sebep)
            let userx = this.client.users.cache.get(res.yetkili)
            let sonraki = Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" })) + res.date
            const mutelendı = new Discord.MessageEmbed()
                .setAuthor(userx.tag, userx.displayAvatarURL({ dynamic: true }))
                .setColor("32CD32")
                .setFooter(`Ceza Numarası: #${res.cezano}`)
                .setDescription(`${member} (\`${member.user.tag}\` - \`${member.id}\`) kişisinin ${await this.client.turkishDate(res.date)} süresi boyunca ses mute cezası otomatik olarak başlatıldı.\n\n• Susturulma sebebi: \`${res.sebep}\`\n• Ses Mute atılma tarihi: \`${moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")}\`\n• Ses Mute bitiş tarihi: \`${moment(sonraki).format("LLL")}\``)
            await this.client.channels.cache.get(this.client.config.channels.voiceMuteLogs).send(mutelendı)
            await mutes.deleteOne({ user: member.id }, async (err) => {
                if (err) { console.log("Silinemedi.") }
            })
        })
        const logMessage = new Discord.WebhookClient("" + this.client.keys.hookLogs.voiceLogID + "", "" + this.client.keys.hookLogs.voiceLogToken + "");
        let mic = member.voice.selfMute == true ? "Kapalı" : "Açık";
        let hop = member.voice.selfDeaf == true ? "Kapalı" : "Açık";
        setTimeout(() => {
            let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
            .setColor("#43b581")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member} üyesi <#${channel.id}> kanalına giriş yaptı.\n\n\`Kanala girdiği anda:\`\nMikrofonu: **${mic}**\nKulaklığı: **${hop}** \n\n\`\`\`Kanal: ${channel.name} (${channel.id})\nKullanıcı: ${member.user.tag} (${member.id})\nKanala girme: ${moment().tz("Europe/Istanbul").format("LLL")}\`\`\`\n\`Kanalda bulunan üyeler:\` \n\n${ channel.members.filter(x => x.id !== member.id).size <= 0 ? "Kanalda hiç üye yok" : channel.members.filter(x => x.id !== member.id).map(x => `\`${x.displayName}\` [${x.user.tag}]`).slice(0, 10).join("\n")}`)
            .setTimestamp();
        // logMessage.send(embed);
    }, 2000);
  }
};
