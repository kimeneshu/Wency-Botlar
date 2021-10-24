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

    async run(member, oldChannel, newChannel) {
        if (member.user.bot) return;
        if(this.client.channelTime.has(member.id)) {
            this.client.channelTime.delete(member.id)
        }
        this.client.channelTime.set(member.id, {channel: newChannel.id, time: Date.now()})
        const logMessage = new Discord.WebhookClient(""+this.client.keys.hookLogs.voiceLogID+"" , ""+this.client.keys.hookLogs.voiceLogToken+"");
        let mic = member.voice.selfMute == true ? "Kapalı" : "Açık";
        let hop = member.voice.selfDeaf == true ? "Kapalı" : "Açık";
        setTimeout(() => {
        let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag , member.user.displayAvatarURL({dynamic: true}))
            .setColor("#faa61a")
            .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
            .setDescription(`${member} üyesi <#${oldChannel.id}> kanalından <#${newChannel.id}> kanalına geçiş yaptı.\n\n\`Geçiş yaptığı anda:\`\nMikrofonu: **${mic}**\nKulaklığı: **${hop}** \n\n\`\`\`Eski kanal: ${oldChannel.name} (${oldChannel.id})\nYeni kanal: ${newChannel.name} (${newChannel.id})\nKullanıcı: ${member.user.tag} (${member.id})\nGeçiş anı: ${moment().tz("Europe/Istanbul").format("LLL")}\`\`\`\n\`Eski kanalda bulunan üyeler:\` \n\n${oldChannel.members.filter(x => x.id !== member.id).size <= 0 ? "Kanalda hiç üye yok." : oldChannel.members.filter(x => x.id !== member.id).map(x => `\`${x.displayName}\` [${x.user.tag}]`).slice(0,10).join("\n")}\n\n\`Yeni kanalda bulunan üyeler:\` \n\n${newChannel.members.filter(x => x.user.id !== member.user.id).size <= 0 ? "Kanalda hiç üye yok.": newChannel.members.filter(x => x.id !== member.id).map(x => `\`${x.displayName}\` [${x.user.tag}]`).slice(0,10).join("\n")}`)
            .setTimestamp();
        // logMessage.send(embed);
    }, 2000);
  }
};
