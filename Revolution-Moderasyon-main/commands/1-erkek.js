const Command = require("../base/Command.js");
const Discord = require("discord.js");
const kayıtlar = require("../models/kayıtlar.js")
const isimler = require("../models/isimler.js")
class Erkek extends Command {
    constructor(client) {
        super(client, {
            name: "Erkek",
            aliases: ["e", "erkek", "man", "bay"]
        });
    }
    async run(message, args, data) {
    if (!message.member.roles.cache.some(r => this.client.config.roles.registerAuth.includes(r.id))) return;
    let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
    if(!member) return this.client.yolla("Kaydetmek istediğiniz kullanıcıyı belirtip tekrar deneyin!", message.author, message.channel)
    // if(!member.user.username.includes("✬") && !message.member.hasPermission("MANAGE_ROLES")) return this.client.yolla("Şuanlık ✬ revolution adlı sunucuda taglı alım mevcuttur ( ✬ ) tagını alarak kayıt olabilirsin, bir süre sonra tagsız alıma geçildiğinde gelmeyi de tercih edebilirsin.", message.author, message.channel)
    let regex = /✬?•? [A-ZİŞĞÜÖÇÎÔÛÂÊ]{1}[a-zışğüöçâêîôû]+ | [0-9]{1,2}/
    if (regex.test(member.displayName) == false) {
      return this.client.yolla("Üyenin ismi, sunucu isim-yaş formatına uymamakta. Üyenin ismini ve yaşını düzelttikten sonra kayıdını tamamlayabilirsiniz!", message.author, message.channel)
    }
    let cezasayı = await this.client.cezasayı(member.id)
    const cezasıvar = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setDescription("🚫 <@"+member.id+"> kişisine toplam "+cezasayı+" kez ceza-i işlem uygulandığı için kayıt işlemi iptal edildi. Sunucumuzda tüm işlemlerin kayıt altına alındığını unutmayın. Sorun teşkil eden, sunucunun huzurunu bozan ve kurallara uymayan kullanıcılar sunucumuza kayıt olamazlar.\n\nEğer konu hakkında bir şikayetiniz var ise <@&852194278507806777> rolü ve üstlerine ulaşabilirsiniz.")
    .setColor("RANDOM")
    if(cezasayı > 11) {
        if(this.client.kayıtlar.has(message.author.id)) {
            this.client.kayıtlar.delete(message.author.id)
        }
        return message.channel.send(cezasıvar)
    }
    if(member.roles.cache.has(this.client.config.roles.manRoles[0]) || member.roles.cache.has(this.client.config.roles.womanRoles[0])) {
        if(this.client.kayıtlar.has(message.author.id)) {
            this.client.kayıtlar.delete(message.author.id)
        }
        return this.client.yolla("<@"+member+"> kullanıcısı zaten sunucumuza kayıtlı olduğundan dolayı kayıt işlemi iptal edildi!", message.author, message.channel)
    }
    await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
        if (res) {
          if (res.kayıtlar.includes(member.id)) {
            res.erkek = res.erkek
            res.save().catch(e => console.log(e))
          } else {
            res.kayıtlar.push(member.id)
            res.erkek = res.erkek + 1
            res.toplam = res.toplam + 1
            res.save().catch(e => console.log(e))
          }
        } else if (!res) {
          let arr = []
          arr.push(member.id)
          const data = new kayıtlar({
            user: message.author.id,
            erkek: 1,
            kadın: 0,
            toplam: 1,
            kayıtlar: arr
          })
          data.save().catch(e => console.log(e))
        }
      })
    if(!member.roles.cache.has(this.client.config.roles.manRoles[0])) {
        setTimeout(() => {
          member.roles.add(this.client.config.roles.manRoles)
        }, 2000)
        await member.roles.remove(this.client.config.roles.unregisterRoles)
        this.client.yolla("<@"+member.id+"> adlı kullanıcı başarıyla erkek olarak kaydedildi.", message.author, message.channel)
        message.react(this.client.ok)
        this.client.channels.cache.get(this.client.config.channels.generalChat).send("<@"+member+"> adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **"+message.guild.memberCount+"** kişi oldu!").then(msg => { msg.delete({ timeout: 10000 }) })
        isimler.findOne({user: member.id}, async(err,res) => {
            if(!res) {
            let arr = []
            arr.push({isim: member.displayName, state: "<@&852194278334660646>", yetkili: message.author.id})
            let newData = new isimler({
              user: member.id,
              isimler: arr
            })
            newData.save().catch(e => console.log(e))
          } else {
            res.isimler.push({isim: member.displayName, state: "<@&852194278334660646>", yetkili: message.author.id})
            res.save().catch(e => console.log(e))
          }
          })
    }
}
}

module.exports = Erkek;
