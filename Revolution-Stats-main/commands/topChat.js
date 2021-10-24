const Command = require("../base/Command.js");
const moment = require("moment")
const data = require("../models/voice.js")
const Data = require("../models/messages.js");
const Discord = require("discord.js");
require("moment-duration-format")

class Topchat extends Command {
  constructor (client) {
    super(client, {
      name: "topchat",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "eval <expression>",
      aliases: ["tc"]
    });
  }

  async run (message, args, perm) { 
    let yasakli = [
      "852194278519603216",
      "852194278519603217",
      "852194279497662497",
      "852194279300005952",
      "852194279300005953",
      "852194279890878527",
      "852194280083685419",
    ];
    if (!yasakli.includes(message.channel.id)) return;
    let arr = []
    let res = await Data.find({})
    await Promise.all(res.map(x => { 
    for (let [k,v] of x.channels) {
       arr.push({user: x.user, message: v})
    }
    }))
    var result = [];
    arr.reduce(function(res, value) {
      if (!res[value.user]) {
        res[value.user] = { user: value.user, message: 0 };
        result.push(res[value.user])
      }
      res[value.user].message += value.message;
      return res;
    }, {});
    let sortedArr = result.sort((a,b) => b.message - a.message).slice(0,30)
    let text = sortedArr.map(x => `${result.indexOf(x) + 1}. <@${x.user}>: \`${x.message} mesaj\``).join("\n")
    const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 2048}))
    .setThumbnail(message.guild.iconURL({dynamic: true, size: 2048}))
    .setDescription(`Toplam sıralama:\n${text}`)
    .setColor(message.member.roles.hoist.hexColor)
    message.channel.send(embed) 
  }
}

module.exports = Topchat;
  
