const Command = require("../base/Command.js");
const Discord = require("discord.js")
const db = require("../models/vrcRoleCommands")
class Komutlar extends Command {
    constructor(client) {
        super(client, {
            name: "komutlar",
            aliases: ["komutlar", "commands"]
        });
    }

    async run(message, args, data) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return;
        if (!args[0]) return this.client.yolla(`Listelemek istediğiniz komutların argümanlarını belirtiniz. Örnek kullanım:\n\`!komutlar klasik/özel\``, message.author, message.channel)
        if (args[0] == "klasik") {
           const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RANDOM")
            .setDescription(`Tüm klasik komutların listesi;\n${this.client.commands.map(x => `- \`\`${x.help.name}\`\``).join("\n")}`)
           message.channel.send(embed)
        } else if (args[0] == "özel") {
           let res = await db.find({})
           let komutlar = res.map(x => `- \`${x.cmdName}\``).join("\n")
           const special = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Tüm özel komutların listesi;\n${komutlar}`)
           message.channel.send(special)
        }
    }
}

module.exports = Komutlar;
