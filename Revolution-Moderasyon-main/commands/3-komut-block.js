const Command = require("../base/Command.js");
class Uncmd extends Command {
    constructor(client) {
        super(client, {
            name: "uncmd",
            aliases: ["uncmd"]
        });
    }

    async run(message, args, data) {
if(!this.client.config.member.guildOwners.includes(message.author.id)) return
let victim = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
if(!victim) return this.client.yolla("Komut yasağını kaldırmak istediğin kullanıcıyı doğru şekilde belirt ve tekrar dene!", message.author, message.channel)
if(!this.client.blockedFromCommand.includes(victim.id)) return message.channel.send(`${this.client.no} **${victim.user.tag}** kullanıcısı komut yasaklaması listesinde bulunmuyor.`)
let cleanArray = this.client.blockedFromCommand.find(x => x === victim.id)
this.client.blockedFromCommand.splice(this.client.blockedFromCommand.indexOf(cleanArray), 1)
message.channel.send(`${this.client.ok} **${victim.user.tag}** kullanıcısının komut yasağı kaldırıldı.`)
    }
}

module.exports = Uncmd;
