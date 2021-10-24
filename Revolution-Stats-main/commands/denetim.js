const Command = require("../base/Command.js");
const data = require("../models/voice.js")
const Data = require("../models/messages.js")
const Discord = require("discord.js")
class Denetim extends Command {
    constructor(client) {
        super(client, {
            name: "denetim",
            aliases: ["denetim"]
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
          if (!args[0]) return message.channel.send('Rol bulunamadı.');
          var arananRol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || ""
          if (arananRol === "") return message.channel.send('Rol bulunamadı...');
          let pubu
          let kisiSayisi = 0;
          message.channel.send(`${arananRol} Rolündeki kişilerin ses bilgilerini gönderiyorum. Biraz zaman alabilir, bitmesini bekleyin.`);
          let roldekiKsayisi = 0;
          message.guild.members.cache.map(user => {
            if (user.roles.cache.has(arananRol.id)) {
              roldekiKsayisi++;
            }
          })
          message.guild.members.cache.map(user => {
            try {
              if (user.roles.cache.has(arananRol.id)) {
                var text = "";
                //##################
                data.findOne({
                  user: user.id
                }, async (err, res) => {
                  if (!res)
                    text += "<@" + user.id + "> kişisinin kayıtlı ses verisi yok bu yüzden bilgileri gönderemiyorum.";
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
                        arr.push({
                          channel: k,
                          duration: v
                        })
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
                    fairytale.length > 0 ? fairytale = parseInt(fairytale.reduce((a, b) => a + b)) : fairytale = 0
                    game.length > 0 ? game = parseInt(game.reduce((a, b) => a + b)) : game = 0
                    music.length > 0 ? music = parseInt(music.reduce((a, b) => a + b)) : music = 0
                    secret.length > 0 ? secret = parseInt(secret.reduce((a, b) => a + b)) : secret = 0
                    sleep.length > 0 ? sleep = parseInt(sleep.reduce((a, b) => a + b)) : sleep = 0
                    let toplam = parseInt(arr.map(x => x.duration).reduce((a,b) => a+b))
  
                    text += `(<@${user.id}>) Kişisinin ses verileri **Toplam:** \`${getContent(toplam)}\`\n**❯ Kayıt Odaları:** \`${getContent(kayıt)}\`\n**❯ Public Odaları:** \`${getContent(publics)}\`\n**❯ Streamer Odaları:** \`${getContent(stream)}\`\n**❯ Sorun Çözme:** \`${getContent(sorun)}\`\n**❯ Ekip Odaları:** \`${getContent(activity)}\`\n**❯ VK Odaları:** \`${getContent(fairytale)}\`\n**❯ DC Odaları:** \`${getContent(music)}\`\n**❯ Secret Odalar:** \`${getContent(secret)}\`\n**❯ Sleep Room:** \`${getContent(sleep)}\``
                  }
  
                  Data.findOne({
                    user: user.id
                  }, (err, rese) => {
                    if (!rese) {
                      text += "\n**❯ **<@" + user.id + "> **kişisinin kayıtlı mesaj verisi yok bu yüzden bilgileri gönderemiyorum.**";
                    } else {
                      let toplamMessage = [];
                      let mesajKanallar = [];
                      for (var [key, value] of rese.channels) {
                        if (message.guild.channels.cache.has(key)) {
                          mesajKanallar.push({
                            kanal: key,
                            mesaj: value
                          });
                        }
                        toplamMessage.push(value);
                      }
  
                      let mesajLar = mesajKanallar.sort(function (a, b) {
                        return b.mesaj - a.mesaj;
                      });
                      let tok = 0;
                      let array = [];
                      for (tok in mesajLar) {
                        if (message.guild.channels.cache.get(mesajLar[tok].kanal).id == '852194278762610722' ||
                          message.guild.channels.cache.get(mesajLar[tok].kanal).id == '852194279719174212'
                        )
                          array.push(" **" + capitalizeIt(message.guild.channels.cache.get(mesajLar[tok].kanal).name.replace("#", " ").replace(/-/g, " ")) + ":** `" + mesajLar[tok].mesaj + "`");
                      }
                      let mesasVeriler = "";
                      for (let i = 0; i < array.length; i++) {
                        mesasVeriler += array[i] + " ";
                      }
                      text += "\n**❯**" + mesasVeriler + " (**Toplam:** \`" + toplamMessage.reduce((a, b) => a + b) + "\`)";
                    }
                    kisiSayisi++;
                    message.channel.send(`───────────────\n${kisiSayisi}. ${text}\n───────────────`)
                    if (kisiSayisi == roldekiKsayisi)
                      message.channel.send(`${arananRol} Rolündeki **${roldekiKsayisi}** Kişi listelendi.`)
                  })
                });
                //##################          
              }
            } catch (e) {
              const newLocal = '<@' + user.id + '> Ses bilgisini gönderirken sorun oluştu. :' + e;
              message.channel.send(newLocal)
              console.log('Hata: ' + e);
            }
          })
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

module.exports = Denetim;