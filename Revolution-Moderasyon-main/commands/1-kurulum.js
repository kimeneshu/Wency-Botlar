const Command = require("../base/Command.js");
const Discord = require("discord.js");
const kayıtlar = require("../models/kayıtlar.js")
const isimler = require("../models/isimler.js")
class Kurulmak extends Command {
    constructor(client) {
        super(client, {
            name: "Kurulum",
            aliases: ["kurulum"]
        });
    }
    
    async run(message, args, data) {
        if (!this.client.config.member.guildOwners.includes(message.author.id)) return
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RANDOM") 
            const Arr = Discord.Util.splitMessage(`\`\`\`Server Settings\`\`\`Sunucu ID: **${this.client.config.guildID}**\nSunucu Tagı: **${this.client.config.tag}**\nSunucu Özel URL: **https://discord.gg/${this.client.config.guildURL}**\n\`\`\`Channel Settings\`\`\`Genel sohbet kanalı: <#${this.client.config.channels.generalChat}>\nTaglı kullanıcı logu: <#${this.client.config.channels.joinFamilyLog}>\nSunucu kayıt kanalı: <#${this.client.config.channels.registerChat}>\n\`\`\`Role Settings\`\`\`Taşıma yetkisine sahip roller:\n${this.client.config.roles.moveAuth.map(x => `<@&${x}>`).join("  ")}\nKayıt yetkisine sahip roller:\n${this.client.config.roles.registerAuth.map(x => `<@&${x}>`).join("  ")}\nBan yetkisine sahip olan roller:\n${this.client.config.roles.banAuth.map(x => `<@&${x}>`).join("  ")}\nJail yetkisine sahip olan roller:\n${this.client.config.roles.jailAuth.map(x => `<@&${x}>`).join("  ")}\nChat Mute yetkisine sahip olan roller:\n${this.client.config.roles.chatMuteAtuh.map(x => `<@&${x}>`).join("  ")}\n Voice Mute yetkisine sahip olan roller:\n${this.client.config.roles.voiceMuteAuth.map(x => `<@&${x}>`).join("  ")}`, { maxLength: 2000, char: "\n" });
            for (const NewText of Arr) {
              embed.setDescription(NewText);
              message.channel.send(embed);
            }
    }
}

module.exports = Kurulmak;

