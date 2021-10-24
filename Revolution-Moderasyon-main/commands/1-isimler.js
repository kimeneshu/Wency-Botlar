const Command = require("../base/Command.js");
const Discord = require("discord.js")
const isimler = require("../models/isimler.js")

class İsimler extends Command {
  constructor(client) {
    super(client, {
      name: "isimler",
      usage: "erkek",
      aliases: ["isimler"]
    });
  }
  async run(message, args, level) {
    if (!message.member.roles.cache.some(r => this.client.config.roles.registerAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
    let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
    if(!user) return this.client.yolla("Geçmiş isimlerine bakmak istediğin kullanıcıyı belirtmen gerekiyor!", message.author, message.channel)
      isimler.findOne({user: user.id}, async(err, res) => {
          if(!res) return this.client.yolla("<@"+user+"> adlı kullanıcının veritabanında isim kayıtı bulunamadı.", message.author, message.channel)
          const yarrakye = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
          .setDescription(`${user} kişisinin toplamda ${res.isimler.length} isim kayıtı bulundu.\n\n${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}`)
          .setColor("RANDOM")
          message.channel.send(yarrakye).then(message => { message.delete({timeout: 10000})}).then(m => message.react(this.client.ok))
      }) 
  }
}
  module.exports = İsimler;
