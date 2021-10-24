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
        if(this.client.channelTime.has(member.id)) {
        this.client.channelTime.delete(member.id)
        }
        const logMessage = new Discord.WebhookClient("" + this.client.keys.hookLogs.voiceLogID + "", "" + this.client.keys.hookLogs.voiceLogToken + "");
        let mic = member.voice.selfMute == true ? "Kapalı" : "Açık";
        let hop = member.voice.selfDeaf == true ? "Kapalı" : "Açık";
        setTimeout(() => {
        let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
            .setColor("#943639")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member} üyesi <#${channel.id}> kanalından ayrıldı.\n\n\`Kanaldan çıktığı anda:\`\nMikrofonu: **${mic}**\nKulaklığı: **${hop}** \n\n\`\`\`Kanal: ${channel.name} (${channel.id})\nKullanıcı: ${member.user.tag} (${member.id})\nKanaldan çıkma: ${moment().tz("Europe/Istanbul").format("LLL")}\`\`\`\n\`Kanalda bulunan üyeler:\` \n\n${channel.members.filter(x => x.id !== member.id).size <= 0 ? "Kanalda hiç üye yok" : channel.members.filter(x => x.id !== member.id).map(x => `\`${x.displayName}\` [${x.user.tag}]`).slice(0, 10).join("\n")}`)
            .setTimestamp();
        // logMessage.send(embed);
    }, 2000)
    const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_DISCONNECT'
        });
        const disconnectLog = fetchedLogs.entries.first()
        const { executor, target } = disconnectLog
        const timeDiff = Math.abs((new Date().getTime() - disconnectLog.createdAt.getTime()) / 1000)
        if (timeDiff <= 5) return
        console.log(`${executor.tag} adlı kullanıcı, ${member.user.tag} adlı kullanıcıyı bir sesli sohbet kanalından çıkardı.`)
    }
};
