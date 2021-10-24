const Command = require("../base/Command.js");
const Discord = require("discord.js")
const isimler = require("../models/isimler.js")

class İsim extends Command {
  constructor(client) {
    super(client, {
      name: "isim",
      description: "Latency and API response times.",
      usage: "erkek",
      aliases: ["nick"]
    });
  }
  async run(message, args, level) {
    if (!message.member.roles.cache.some(r => this.client.config.roles.registerAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
    let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
    if(!member) return this.client.yolla("İsmini değiştirmek istediğiniz kullanıcıyı belirtip tekrar deneyin.", message.author, message.channel)
    if(!args[1]) return this.client.yolla("Değiştirmek istediğiniz kullanıcı adında isim belirtmelisin.", message.author, message.channel)
    if(!args[2]) return this.client.yolla("Değiştirmek istediğiniz kullanıcı adında yaş belirtmelisin.", message.author, message.channel)
    let isim = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase()
    let yaş = args[2];
    isimler.findOne({user: member.id}, async(err, res) => {
        if(!res) {
            const nicks = member.user.username.includes("✬")
            if (nicks) await member.setNickname(`✬ ${isim} | ${yaş}` )
            else await member.setNickname(`• ${isim} | ${yaş}`);
            this.client.yolla("<@"+member+"> üyesinin ismi başarıyla `"+isim+" | "+yaş+"` olarak değiştirildi.", message.author, message.channel)
            message.react(this.client.ok)
             if(message.channel.id === this.client.config.channels.registerChat) {
                 if(!this.client.kayıtlar.has(message.author.id)) {
                     this.client.kayıtlar.set(message.author.id, member.id)
                 }
             }
        } else {
            const nicks = member.user.username.includes("✬")
            if (nicks) await member.setNickname(`✬ ${isim} | ${yaş}` )
            else await member.setNickname(`• ${isim} | ${yaş}`);
            const memeaç = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`${member} kişisinin ismi başarıyla \`"${isim} | ${yaş}"\` olarak değiştirildi, bu üye daha önce bu isimlerle kayıt olmuş.\n\n${this.client.no} Kişinin toplamda **${res.isimler.length}** isim kayıtı bulundu.\n${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}\n\nKişinin önceki isimlerine \`!isimler @üye\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`)
            .setColor("RANDOM")
            message.channel.send(memeaç).then(m => m.delete({timeout: 10000})).then(m => message.react(this.client.ok))
             if(message.channel.id === this.client.config.channels.registerChat) {
                 if(!this.client.kayıtlar.has(message.author.id)) {
                     this.client.kayıtlar.set(message.author.id, member.id)
                 }
             }
        } 
          
    })  
}
}
  module.exports = İsim;
