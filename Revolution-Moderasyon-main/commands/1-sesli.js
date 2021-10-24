const Command = require("../base/Command.js");
const Discord = require("discord.js");
class Sesli extends Command {
    constructor(client) {
        super(client, {
            name: "Sesli",
            aliases: ["sesli"]
        });
    }
 async run(message, args, data) {
if(!message.member.hasPermission("VIEW_AUDIT_LOG")) return;
let pub = message.guild.channels.cache.filter(x => x.parentID == this.client.config.channels.publicParentID && x.type == "voice").map(u => u.members.size).reduce((a,b) => a+b)
let ses = message.guild.members.cache.filter(x => x.voice.channel).size
let tagges = message.guild.members.cache.filter(x => {
return x.user.username.includes("✬") && x.voice.channel && !x.roles.cache.has(this.client.config.roles.botCommandRole)}).size
let notag = message.guild.members.cache.filter(x => {
return !x.user.username.includes("✬") && x.voice.channel}).size
let yetkili = message.guild.members.cache.filter(x => {
return x.user.username.includes("✬") && x.voice.channel && x.roles.cache.has(this.client.config.roles.botCommandRole)}).size
const embed = new Discord.MessageEmbed()
.setColor("RANDOM")
.setDescription(`Sesli kanallarda toplam **${ses}** kişi var!
───────────────
Public odalarda **${pub}** kişi var!
Ses kanallarında **${notag}** normal kullanıcı var!
Ses kanallarında **${tagges}** taglı kullanıcı var!
Ses kanallarında toplam **${yetkili}** yetkili var!`)
return message.channel.send(embed).then(m => message.react(this.client.ok));        
}
}
module.exports = Sesli;
