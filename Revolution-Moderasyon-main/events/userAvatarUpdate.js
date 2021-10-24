const Discord = require("discord.js");
const moment = require("moment-timezone");

module.exports = class {
    constructor(client) {
        this.client = client;
    }
  
    async run(user, oldAvatarURL, newAvatarURL) {
        const logMessage = new Discord.WebhookClient("" + this.client.keys.hookLogs.discordUserLogID + "", "" + this.client.keys.hookLogs.discordUserLogToken + "");
        let embed = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
            .setDescription(`${user} üyesi Discord Profil resmini değiştirdi.\n\nEski:\n[Görsel için tıkla](${oldAvatarURL})\nYeni:\n[Görsel için tıkla](${newAvatarURL})\n\n\`\`\`Kullanıcı: ${user.tag} (${user.id})\nDeğiştirme tarihi: ${moment().tz("Europe/Istanbul").format("LLL")}\`\`\``)
            .setThumbnail(user.displayAvatarURL({dynamic: true}));
            logMessage.send(embed);
    }
};