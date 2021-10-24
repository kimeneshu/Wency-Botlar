const Command = require("../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../models/cantUnBan.js")
class BanBilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ban-bilgi",
            aliases: ["banbilgi"]
        });
    }

    async run(message, args, client) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.banAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
      let embed = new Discord.MessageEmbed()
      embed.setColor("RANDOM")
      embed.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
      
      await this.client.users.fetch(args[0]).then(res => {
          if(!res){
              embed.setDescription("Geçerli bir kullanıcı ID si giriniz.")
              return message.channel.send(embed)
          }else{
              message.guild.fetchBans(true).then(async(bans) => {
                  let ban = await bans.find(a => a.user.id === res.id)
                  if(!ban){
                      embed.setDescription(`\`${res.tag}\` bu sunucuda yasaklı değil!`)
                      return message.channel.send(embed)
                  }else{
                      let text = `:no_entry_sign:  ${res.tag} (\`${res.id}\`) adlı kullanıcı sunucumuzdan şu sebepten dolayı yasaklanmış:\n\n"${ban.reason || "Sebep Belirtilmemiş."}"`
                     await db.findOne({userid: res.id}, async(err,dbres) => {
                          if(dbres){
                              text = `:warning: **BU YASAKLAMA <@${dbres.mod}> TARAFINDAN AÇILAMAZ OLARAK ETİKETLENMİŞTİR.**\n\n:mag_right: ${res.tag} (\`${res.id}\`) adlı kullanıcı bu sunucudan şu sebepten dolayı yasaklanmış:\n\n"${ban.reason || "Sebep Belirtilmemiş."}"`
                          }
                      })
                      message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                          let user = audit.entries.find(a => a.target.id === res.id)
                          if(user){
                              embed.setDescription(text + `\n─────────────────────────────\nKullanıcı, ${user.executor.tag} (\`${user.executor.id}\`) tarafından ${moment(user.createdAt).format("lll")} tarihinde yasaklanmış.`)
                              return message.channel.send(embed)
                          }else{
                              embed.setDescription(text + "\n\nBu yasaklama, son 100 yasaklama içinde olmadığından dolayı ban bilgisini yazamıyorum.")
                              return message.channel.send(embed)
                          }
                      })
                  }
              })
          }
      }).catch(err => {
          embed.setDescription("Geçerli bir kullanıcı ID si giriniz.")
              return message.channel.send(embed)
      })
    }
}



module.exports = BanBilgi;
