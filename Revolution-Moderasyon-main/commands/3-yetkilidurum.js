const Command = require("../base/Command.js");
const Discord = require("discord.js");

class Yetkilidurum extends Command {
    constructor(client) {
        super(client, {
            name: "yetkili-durum",
            aliases: ["yetkilidurum", "ytdurum", "ydurum"]
        });
    }
    async run(message, args, level) {
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        const avatarsexporno = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(`• Sunucumuzda bulunan toplam yetkili sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.some(r => this.client.config.roles.allManagementRoles.includes(r.id))).size}\`\n• Sunucumuzda aktif olup seste olmayan yetkili sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.some(r => this.client.config.roles.allManagementRoles.includes(r.id)) && !x.voice.channel && x.user.presence.status !== "offline").size}\`\n• Sunucumuzda ses kanallarında bulunan yetkili sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.some(r => this.client.config.roles.allManagementRoles.includes(r.id)) && x.voice.channel).size}\``)
        .setColor("PURPLE")
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        message.channel.send(avatarsexporno).then(message => { message.delete({ timeout: 10000}) })
    }
}

module.exports = Yetkilidurum;
//