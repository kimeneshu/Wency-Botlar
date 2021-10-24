const Command = require("../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Snipe extends Command {
    constructor(client) {
        super(client, {
            name: "snipe",
            aliases: ["snipe"]
        });
    }

    async run(message, args, data) {
let mesaj = this.client.snipe.get(message.channel.id)
if(!mesaj) return message.react("🚫")
const embed = new Discord.MessageEmbed()
.setColor("RANDOM")
.setAuthor(mesaj.author.tag, mesaj.author.displayAvatarURL({dynamic: true}))
.setDescription(mesaj.content)
.setFooter("Silinen Tarih: " + moment(mesaj.createdTimestamp).add(3, 'hour').format("ll") + ", " + moment(mesaj.createdTimestamp).add(3, 'hour').format("LTS"))
message.channel.send(embed).then(msg => { msg.delete({ timeout: 3500 }) })
this.client.snipe.delete(message.channel.id)
        
    }
}

module.exports = Snipe;
