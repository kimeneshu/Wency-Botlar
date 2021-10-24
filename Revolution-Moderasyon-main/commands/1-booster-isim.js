const Command = require("../base/Command.js");
const Discord = require("discord.js")
class Booster extends Command {
    constructor(client) {
        super(client, {
            name: "booster-nick",
            aliases: ["bisim", "b-isim"]
        });
    }
 async run(message, args, data) {
     if (!message.member.roles.cache.some(r => this.client.config.roles.boosterRole.includes(r.id))) return;
     let isim = args.slice().join(" ");
     if(!isim) return this.client.yolla("Kendi ismini ayarlamak için istediğin ismi belirtmen gerekiyor!", message.author, message.channel)
     let olmaz = /([^a-zA-ZIıİiÜüĞğŞşÖöÇç0-9 ]+)/gi;
     if(isim.match(olmaz)) return this.client.yolla("Belirttiğin kullanıcı adında özel harfler bulunmaması gerekir lütfen tekrar dene!", message.author, message.channel)
     try {
        const nicks = message.member.user.username.includes("✬");
        if (nicks) await message.member.setNickname(`✬ ${isim}`);
        else await message.member.setNickname(`• ${isim}`);
        const başarılı = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription("Belirttiğin kullanıcı adı başarıyla değiştirilmiştir.")
        .setColor("RANDOM")
        message.channel.send(başarılı).then(message => { message.delete({ timeout: 10000 }) }).catch(e => console.log(e)).then(m => message.react(this.client.ok))
     } catch (error) {
         const hata = new Discord.MessageEmbed()
         .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
         .setDescription("Bir hata ile karşılaştım | **"+error+"**")
         .setColor("RANDOM")
         message.channel.send(hata).then(m => message.delete({ timeout : 5000})).catch(e => console.log(e)).then(m => message.react(this.client.no))
     }
 }
}
module.exports = Booster;
