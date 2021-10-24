const Command = require("../base/Command.js");
const Discord = require("discord.js")
const db = require("../models/cantUnBan.js");
const { schema } = require("../models/cantUnBan.js");
class unban extends Command {
  constructor(client) {
    super(client, {
      name: "unban",
      usage: "erkek",
      aliases: ["unban" , "unban"]
    });
  };
  async run(message, args, client) {
   const whoisuseridd = args[0]
   if (whoisuseridd.length < 17) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel) 
   if (whoisuseridd.length > 18) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel)
   if (isNaN(whoisuseridd)) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel)
   if (!message.member.roles.cache.some(r => this.client.config.roles.banAuth.includes(r.id))) return;
   let sChannel = message.guild.channels.cache.find(c => c.id === this.client.config.channels.unbanLogs)
   const member = await this.client.users.fetch(whoisuseridd)
   await db.findOne({ user: member.id }, async (err, doc) => {
  
    message.guild.fetchBans(true).then(async (bans) => {
      let ban = await bans.find(a => a.user.id === member.id)
      if (!ban) {
         this.client.yolla('**'+member.tag+'** üyesi zaten sunucuda yasaklı değil.', message.author , message.channel)
         message.react(this.client.no)
        }
    else if(doc) {
      this.client.yolla('**'+member.tag+'** üyesinin yasağı <@'+doc.mod+'> yetkilisi tarafından açılmaz olarak işaretlendi.', message.author , message.channel)
      message.react(this.client.no)
    } else {
     message.guild.members.unban(member.id)
     this.client.yolla('**'+member.tag+'** üyesinin yasağı <@'+message.author.id+'> tarafından kaldırıldı.', message.author , message.channel)
     const embed = new Discord.MessageEmbed()
     .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
     .setColor("ff0000")
     .setDescription('**'+member.tag+'** üyesinin yasağı <@'+message.author.id+'> tarafından kaldırıldı.')
     sChannel.send(embed)
     message.react(this.client.ok)
    }
  }) })
}
}
module.exports = unban;

