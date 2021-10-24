const Discord = require("discord.js")
const moment = require("moment")
module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (oldMessage, newMessage) {
  if(newMessage.author.bot) return
  const hook = new Discord.WebhookClient("" + this.client.keys.hookLogs.messageLogID + "", "" + this.client.keys.hookLogs.messageLogToken + "");
  let embed = new Discord.MessageEmbed()
  .setAuthor(newMessage.author.tag , newMessage.author.displayAvatarURL({ dynamic: true}))
  .setDescription("<@"+newMessage.author.id+"> üyesi <#"+newMessage.channel.id+"> kanalında mesajını düzenledi.\n\n > **__Eski mesaj__:** ``"+oldMessage.content+"``\n\n > **__Yeni mesaj__:** ``"+newMessage.content+"``\n\n```Kanal: "+newMessage.channel.name+" ("+newMessage.channel.id+")\nKullanıcı: "+newMessage.author.tag+" ("+newMessage.author.id+")\nMesaj ID: "+newMessage.id+"\nMesaj Atılış: "+moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")+"```")
  .setThumbnail(newMessage.author.displayAvatarURL({dynamic: true}))
  .setColor('BLUE') 
  if(!hook) console.log('Log kanalı bulunamadı!')
  hook.send(embed)
  }
};