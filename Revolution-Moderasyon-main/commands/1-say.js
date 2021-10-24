const Command = require("../base/Command.js");
const Discord = require("discord.js");
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "Say",
            aliases: ["say"]
        });
    }
    async run(message, args, data) {
        if(!message.member.hasPermission("MANAGE_ROLES")) return;
        let tag = this.client.users.cache.filter(x => x.username.includes("✬")).size + 250
        let ses = message.guild.members.cache.filter(x => x.voice.channel).size
        let members = message.guild.members.cache.size
        let boost = message.guild.premiumSubscriptionCount || "Sunucuda boost takviyesi bulunmamakta."
        let online = message.guild.members.cache.filter(m => m.presence.status !== "offline").size
        let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription("`•` Seste toplam **"+ses+"** kullanıcı var.\n`•` Toplam **"+tag+"** kişi tagımıza sahip.\n`•` Sunucumuzda toplam **"+members+"** üye var.\n`•` Sunucumuza toplam **"+boost+"** takviye yapılmış.\n`•` Sunucumuzda toplam **"+online+"** çevrimiçi üye var.")
        message.channel.send(embed).then(m => message.react(this.client.ok));    
    }
}
    module.exports = Say;
