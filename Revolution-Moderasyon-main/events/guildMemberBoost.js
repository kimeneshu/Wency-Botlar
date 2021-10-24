const Discord = require("discord.js")
const moment = require("moment-timezone")
module.exports = class {
  constructor (client) {
    this.client = client;
  }
  async run (member) {
   const hook = new Discord.WebhookClient("" + this.client.keys.hookLogs.boostLogID + "", "" + this.client.keys.hookLogs.boostLogToken + "");
   let embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag , message.author.displayAvatarURL({ dynamic: true}))
   .setDescription(`${member} adlı kullanıcı ${member.guild.name} adlı sunucuya takviye yaptı.\n\n\`\`\`Takviye yapan kullanıcı: ${member.user.tag} ( ${member.id} )\nTakviye yaptığı tarih: ${moment().tz("Europe/Istanbul").format("LLL")}\nSunucunun ulaştığı toplam takviye sayısı: ${member.guild.premiumSubscriptionCount || "Sunucuda boost takviyesi bulunmamakta."}`)
   .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
   .setColor('RED') 
   if(!hook) console.log('Log kanalı bulunamadı!')
   hook.send(embed)
  }
};