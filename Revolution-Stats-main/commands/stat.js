const Command = require("../base/Command.js");
const data = require("../models/voice.js")
const Data = require("../models/messages.js")
const Discord = require("discord.js")
const ms = require("ms")
class STAT extends Command {
    constructor(client) {
        super(client, {
            name: "me",
            aliases: ["stats"]
        });
    }

    async run(message, args, client) {
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
          var user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || message.author
          let member = message.guild.members.cache.get(user.id);
          const embed = new Discord.MessageEmbed()
            .setAuthor(user.tag, user.avatarURL({ dynamic: true }))
            .setThumbnail(user.avatarURL({ dynamic: true }))
            .setColor(member.displayHexColor || "RANDOM")
            .setDescription(`${member} (${member.roles.hoist || member.roles.highest}) kişisinin sunucu verileri`)
          data.findOne({ user: user.id }, async (err, res) => {
            if (!res) return message.channel.send("<@" + user.id + "> kişisinin kayıtlı ses verisi yok bu yüzden bilgileri gönderemiyorum.")
            if (res) {
              if (!res.state !== "") {
                if (res.channels.has(res.state)) {
                  res.channels.set(
                    res.state,
                    res.channels.get(res.state) + Date.now() - res.start
                  );
                }
              } else {
                res.channels.set(res.state, Date.now() - res.start);
              }
              let arr = []
              for (let [k, v] of res.channels) {
                if (message.guild.channels.cache.has(k)) {
                  arr.push({ channel: k, duration: v })
                }
              }
              let kayıt = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "866388835716562984").map(x => x.duration)
              let sorun = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "866388688077062144").map(x => x.duration)
              let publics = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "866387473114595329" && !["866398072921128960"].includes(x.channel)).map(x => x.duration)
              let stream = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "866388317696032797").map(x => x.duration)
              let activity = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "856712347825733643").map(x => x.duration)
              let fairytale = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "852194281829433367").map(x => x.duration)
              let music = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "852194280612429854").map(x => x.duration)
              let game = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "852194281615917068").map(x => x.duration)
              let secret = arr.filter(x => message.guild.channels.cache.get(x.channel).parentID === "866386101186723861").map(x => x.duration)
              let sleep = arr.filter(x => x.channel === "866398072921128960").map(x => x.duration)
              kayıt.length > 0 ? kayıt = parseInt(kayıt.reduce((a, b) => a + b)) : kayıt = 0
              sorun.length > 0 ? sorun = parseInt(sorun.reduce((a, b) => a + b)) : sorun = 0
              publics.length > 0 ? publics = parseInt(publics.reduce((a, b) => a + b)) : publics = 0
              stream.length > 0 ? stream = parseInt(stream.reduce((a, b) => a + b)) : stream = 0
              activity.length > 0 ? activity = parseInt(activity.reduce((a, b) => a + b)) : activity = 0
              music.length > 0 ? music = parseInt(music.reduce((a, b) => a + b)) : music = 0
              fairytale.length > 0 ? fairytale = parseInt(fairytale.reduce((a, b) => a + b)) : fairytale = 0
              game.length > 0 ? game = parseInt(game.reduce((a, b) => a + b)) : game = 0
              secret.length > 0 ? secret = parseInt(secret.reduce((a, b) => a + b)) : secret = 0
              sleep.length > 0 ? sleep = parseInt(sleep.reduce((a, b) => a + b)) : sleep = 0
              let toplam = parseInt(arr.map(x => x.duration).reduce((a,b) => a+b))
              let xp = 0
              xp = xp + parseInt((toplam) / 120000)
              xp = xp + parseInt((publics * 15) / 120000)
              xp = xp + parseInt((kayıt * 10) / 120000)
              embed.setFooter(`Yetkili XP: ${xp}`)
                                   if(parseInt(publics) < ms("15h")) {
                embed.addField("❯ Rozet Durumu", "Ah güzel dostum henüz bir rozete sahip değilsin. <@&852194278373064704> rozetini elde etmek için public kanallarda  "+getContent(ms("15h") - publics)+" geçirmen gerekiyor.", false)
          }  
          if(parseInt(publics) > ms("15h") && parseInt(publics) < ms("30h")) {
              embed.addField("❯ Rozet Durumu", "Tebrikler <@&852194278373064704> rozetine sahipsin! Bir sonraki <@&852194278373064705> rozeti elde etmek için public kanallarda "+getContent(ms("30h") - publics)+" geçirmen gerekiyor.", false)
          } if(parseInt(publics) > ms("30h") && parseInt(publics) < ms("45h") ) {
              embed.addField("❯ Rozet Durumu", "Tebrikler <@&852194278373064705> rozetine sahipsin! Bir sonraki <@&852194278373064706> rozeti elde etmek için public kanallarda "+getContent(ms("45h") - publics)+" geçirmen gerekiyor.", false)
          }
          if(parseInt(publics) > ms("45h") && parseInt(publics) < ms("60h")) {
              embed.addField("❯ Rozet Durumu", "Tebrikler <@&852194278373064706> rozetine sahipsin! Bir sonraki <@&852194278373064707> rozeti elde etmek için public kanallarda "+getContent(ms("60h") - publics)+" geçirmen gerekiyor.", false)
          } 
          if(parseInt(publics) > ms("60h") && parseInt(publics) < ms("80h")) {
              embed.addField("❯ Rozet Durumu", "Tebrikler <@&852194278373064707> rozetine sahipsin! Bir sonraki <@&852194278373064708> rozeti elde etmek için public kanallarda "+getContent(ms("80h") - publics)+" geçirmen gerekiyor.", false)
          } 
          if(parseInt(publics) > ms("80h")) {
              embed.addField("❯ Rozet Durumu", "İnanılmazsın usta ! <@&852194278373064708> rozetine sahipsin! Bu harika bi his olmalı!", false)
          }
          if(parseInt(publics) > ms("15h") && parseInt(publics) < ms("30h") && !member.roles.cache.has("852194278373064704") ) {
            if(!member.roles.cache.has("852194278373064704")) {
              member.roles.add("852194278373064704")
              embed.addField("✨ Tebrikler, yeni rozet!", "Toplam public saat süren 15 saati geçtiği için <@&852194278373064704> rolünü kazandın! Bir sonraki <@&852194278373064705> rolünü elde etmek için "+getContent(ms("30h") - publics)+" geçirmen gerekiyor.", false)
            }
          } 
          if(parseInt(publics) > ms("30h") && parseInt(publics) < ms("45h") && !member.roles.cache.has("852194278373064705") ) {
            if(!member.roles.cache.has("852194278373064705")) {
              member.roles.remove("852194278373064704")
              member.roles.add("852194278373064705")
              embed.addField("✨ Tebrikler, yeni rozet!", "Toplam public saat süren 30 saati geçtiği için <@&852194278373064705> rolünü kazandın! Bir sonraki <@&852194278373064706> rolünü elde etmek için "+getContent(ms("45h") - publics)+" geçirmen gerekiyor.", false)
            }
          } 
          if(parseInt(publics) > ms("45h") && parseInt(publics) < ms("60h") && !member.roles.cache.has("852194278373064706")) {
            if(!member.roles.cache.has("852194278373064706")) {
              member.roles.remove("852194278373064705")
              member.roles.add("852194278373064706")
              embed.addField("✨ Tebrikler, yeni rozet!", "Toplam public saat süren 45 saati geçtiği için <@&852194278373064706> rolünü kazandın! Bir sonraki <@&852194278373064707> rolünü elde etmek için "+getContent(ms("60h") - publics)+" geçirmen gerekiyor.", false)
            }
          } 
          if(parseInt(publics) > ms("60h") && parseInt(publics) < ms("80h") && !member.roles.cache.has("852194278373064707")) {
            if(!member.roles.cache.has("852194278373064707")) {
              member.roles.remove("852194278373064706")
              member.roles.add("852194278373064707")
              embed.addField("✨ Tebrikler, yeni rozet!", "Toplam public saat süren 60 saati geçtiği için <@&852194278373064707> rolünü kazandın! Bir sonraki <@&852194278373064708> rolünü elde etmek için "+getContent(ms("80h") - publics)+" geçirmen gerekiyor.", false)
            }
          }
          if(parseInt(publics) > ms("80h") && !member.roles.cache.has("852194278373064708")) {
            if(!member.roles.cache.has("852194278373064708")) {
              member.roles.remove("852194278373064707")
              member.roles.add("852194278373064708")
              embed.addField("✨ Tebrikler, yeni rozet!", "Toplam public saat süren 80 saati geçtiği için <@&852194278373064708> rolünü kazandın! Üstün aktifliğinden dolayı son rütbeye kadar geldin. Seni kutsuyorum!", false)
            }
          }
              let filterArr = arr.sort((a, b) => b.duration - a.duration)
              let channelSize = filterArr.length
              filterArr.length > 10 ? filterArr.length = 10 : filterArr.length = filterArr.length
              let channels = []
              let num = 1
              for (let i = 0; i < filterArr.length; i++) {
                channels.push(`\`${num++}.\` ${message.guild.channels.cache.get(filterArr[i].channel).name}: \`${getContent(filterArr[i].duration)}\` `)
              }
              if (channels.length > 0) {
                embed.addField("❯ Kanal Bilgileri", `\`•\` Toplam: \`${getContent(toplam)}\`\n\`•\` Kayıt Odaları: \`${getContent(kayıt)}\`\n\`•\` Public Odaları: \`${getContent(publics)}\`\n\`•\` Sorun Çözme: \`${getContent(sorun)}\`\n\`•\` Ekip Odaları: \`${getContent(activity)}\`\n\`•\` Stream Odaları: \`${getContent(stream)}\`\n\`•\` DC Odaları: \`${getContent(music)}\`\n\`•\` Oyun Odaları: \`${getContent(game)}\`\n\`•\` VK Odaları: \`${getContent(fairytale)}\`\n\`•\` Secret Odalar: \`${getContent(secret)}\`\n\`•\` Sleep Room: \`${getContent(sleep)}\``)
                embed.addField("❯ Kanal Sıralaması (" + channelSize + " kanalda bulunmuş)", channels.join("\n"), true)
              }
            }
            Data.findOne({ user: user.id }, (err, rese) => {
              if (!rese) return message.channel.send("<@" + user.id + "> kişisinin kayıtlı ses verisi yok bu yüzden bilgileri gönderemiyorum.")
              let toplammessage = [];
              let mesajKanallar = [];
              for (var [key, value] of rese.channels) {
                if (message.guild.channels.cache.has(key)) {
                  mesajKanallar.push({ kanal: key, mesaj: value });
                }
                toplammessage.push(value);
              }
    
              let mesajLar = mesajKanallar.sort(function (a, b) {
                return b.mesaj - a.mesaj;
              });
              mesajLar.length = 10;
              let tok = 0;
              let array = [];
              let nume = 1
              for (tok in mesajLar) {
                array.push(`\`${nume++}.\`` +
                  " " + capitalizeIt(message.guild.channels.cache.get(mesajLar[tok].kanal).name.replace("#", " ").replace(/-/g, " ")) + ": `" + mesajLar[tok].mesaj + "`"
                );
              }
              embed.addField("❯ Mesaj Bilgisi", `\`•\` Toplam: \`${toplammessage.reduce((a, b) => a + b)}\`\n\`•\` 24 Saat: \`0\`\n\`•\` 72 Saat: \`0\`\n\`•\` 1 Hafta: \`0\` `, false)
              embed.addField("❯ Mesaj Sıralaması (Toplam: " + toplammessage.reduce((a, b) => a + b) + ")", array.join("\n"), false)
              message.channel.send(embed).catch(e => message.channel.send(`${message.author} bir sorun oluştu... Lütfen ses kanalından çıkıp tekrar girdikten sonra komutu uygulayabilir misin? Merak etme verilerin kaybolmayacak!`))
            })
          });
    }
}

function capitalizeIt(str) {
    if (str && typeof (str) === "string") {
      str = str.split(" ");
      for (var i = 0, x = str.length; i < x; i++) {
        if (str[i]) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
      }
      return str.join(" ");
    } else {
      return str;
    }
  }
  function getContent(duration) {
    let arr = []
    if (duration / 3600000 > 1) {
      let val = parseInt(duration / 3600000)
      let durationn = parseInt((duration - (val * 3600000)) / 60000)
      arr.push(`${val} saat`)
      arr.push(`${durationn} dk.`)
    } else {
      let durationn = parseInt(duration / 60000)
      arr.push(`${durationn} dk.`)
    }
    return arr.join(", ")
  }

module.exports = STAT;
