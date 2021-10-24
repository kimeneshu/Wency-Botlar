const Discord = require("discord.js")
const moment = require("moment")
module.exports = class {
  constructor (client) {
    this.client = client;
  }
  async run (message) {
     if(message.author.bot) return
     this.client.snipe.set(message.channel.id, message)
   if(message.author.bot) return
   const hook = new Discord.WebhookClient("" + this.client.keys.hookLogs.messageLogID + "", "" + this.client.keys.hookLogs.messageLogToken + "");
   let embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag , message.author.displayAvatarURL({ dynamic: true}))
   .setDescription("<@"+message.author.id+"> üyesi <#"+message.channel.id+"> kanalında mesajını sildi.\n\n**__Silinen mesaj__:** ``"+message.content+"`` \n\n```Kanal: "+message.channel.name+" ("+message.channel.id+")\nKullanıcı: "+message.author.tag+" ("+message.author.id+")\nMesaj ID: "+message.id+"\nMesaj Atılış: "+moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")+"```")
   .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
   .setColor('RED') 
   if(!hook) console.log('Log kanalı bulunamadı!')
   hook.send(embed)
  }
};