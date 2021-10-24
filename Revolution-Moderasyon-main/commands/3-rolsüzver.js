const Command = require("../base/Command.js");
const Discord = require("discord.js");
class Rolsüzver extends Command {
    constructor(client) {
        super(client, {
            name: "Rolsüz-Ver",
            aliases: ["rolsüz"]
        });
    }
    async run(message, args, data) {
        if(!this.client.config.botOwners.includes(message.author.id)) return
        let rolsuz = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
        if(args[0] == "ver") {
            rolsuz.forEach(r => {
                r.roles.add(this.client.config.roles.unregisterRoles)
            })
            const perfmonce = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setDescription("Sunucuda role sahip olmayan **"+rolsuz.size+"** kişiye \"Outer Revolutinaries\" rolünü verdim.")
            .setColor("RANDOM")
            message.channel.send(perfmonce)
        } else if(!args[0]) {
            const bariskio = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setDescription("Sunucuda role sahip olmayan toplam **"+rolsuz.size+"** kişi bulunmaktadır. Bu kişilere kayıtsıza rolü vermek için `!rolsüz ver` komutunu uygulamanız gerekiyor.")
            .setColor("RANDOM")
            message.channel.send(bariskio)
        }
    }
}
module.exports = Rolsüzver;