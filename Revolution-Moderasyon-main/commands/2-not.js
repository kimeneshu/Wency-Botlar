const Command = require("../base/Command.js");
const Discord = require("discord.js");
const notlar = require("../models/notlar.js")
class Not extends Command {
    constructor(client) {
        super(client, {
            name: "Not",
            aliases: ["not"]
        });
    }
    async run(message, args, data) {
        if (!message.member.roles.cache.some(r => this.client.config.roles.jailAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Not bırakmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene !", message.author, message.channel)
        if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return this.client.yolla("Ceza notu bırakmak istediğiniz kişinin rolleri sizden yüksekte!", message.author, message.channel)
        if(user.id == message.author.id) return this.client.yolla("Kendi kendine ceza notu bırakamazsın!", message.author, message.channel)
        await notlar.findOne({user: user.id}, async (err, res) => {
          if (!args.slice(1).join(" ")) return this.client.yolla("Kişiye bırakmak istediğin notu yaz ve tekrar dene !", message.author, message.channel)
        if(!res) {
         let arr = []
         arr.push({not:args.slice(1).join(" "), yetkili: message.author.id })
         const newData = new notlar({
             user: user.id,
             notlar: arr
         })
         newData.save().catch(e => console.log(e))
         this.client.yolla(`<@${user.id}> kişisine başarıyla not bırakıldı.\n\n:no_entry_sign: Bırakılan ceza notu: **${args.slice(1).join(" ")}**`, message.author, message.channel)
        } else {
            res.notlar.push({not:args.slice(1).join(" "), yetkili: message.author.id })
            res.save().catch(e => console.log(e))
            this.client.yolla(`<@${user.id}> kişisine başarıyla not bırakıldı.\n\n:no_entry_sign: Bırakılan ceza notu: **${args.slice(1).join(" ")}**`, message.author, message.channel)
        }
        })
      }
    }

module.exports = Not;
