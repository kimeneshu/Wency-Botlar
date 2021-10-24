const Command = require("../base/Command.js");
const Discord = require("discord.js")
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av", "pp"]
        });
    }
//
    async run(message, args, data) {
if(!message.member.hasPermission("VIEW_AUDIT_LOG") && message.channel.id !== "kanalid") return
let user = args.length > 0 ? message.mentions.users.first() || await this.client.users.fetch(args[0]) || message.author : message.author
if(!user) return this.client.yolla("Avatarına bakmak istediğin kullancıyı belirtmen gerekir. `!avatar @Wéncy/ID`", message.author, message.channel)
let embed = new Discord.MessageEmbed()
.setDescription(`**${user.tag}** adlı kullanıcının profil fotoğrafı!`)
.setImage(user.displayAvatarURL({dynamic: true, size: 2048}))
.setFooter(`${message.author.tag} tarafından istendi!`)
message.channel.send(embed)
    }
}

module.exports = Avatar;
