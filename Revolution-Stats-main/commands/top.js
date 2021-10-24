const Command = require("../base/Command.js");
const data = require("../models/voice.js")
const Data = require("../models/messages.js")
const Discord = require("discord.js")
class TOP extends Command {
    constructor(client) {
        super(client, {
            name: "top",
            aliases: ["top"]
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
          let embede = new Discord.MessageEmbed();
          embede.setColor(message.member.displayHexColor);
          embede.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
          let declarearr = []
    
          let map = new Map([
            ["1", "Toplam"],
            ["2", "Kayıt Odaları"],
            ["3", "Ekip Odaları"],
            ["4", "Oyun Odaları"],
            ["5", "Public Odalar"],
            ["6", "Stream Odaları"],
            ["7", "Secret of Revolution"],
            ["8", "Sleep Room"],
            ["9", "Sorun Çözme"],
          ])
    
          let roleMap = new Map([
            ["--rvt", "852194278519603210"],
            ["--rebel", "852194278507806778"],
            ["--always", "852194278507806776"],
            ["--pioneer", "852194278507806771"],
            ["--prodigy", "852194278507806770"],
            ["--valiant", "852194278485917766"],
            ["--guide", "852194278485917765"],
            ["--reputable", "852194278485917764"],
            ["--majesty", "852194278485917763"],
            ["--crusader", "852194278485917761"],
            ["--raider", "852194278485917760"],
            ["--predatory", "852194278485917759"],
            ["--deviser", "852194278485917758"],
            ["--artificer", "852194278485917757"],
            ["--wise", "852194278461276219"],
            ["--shadow", "852194278461276211"],
            ["--dreid", "852194278461276210"],
            ["--shade", "852194278443712551"],
            ["--moon", "852194278443712550"],
            ["--rise", "852194278443712549"],
            ["--legion", "858824388819419158"],
          ])
    
          let number = args.join(" ").split(" ");
          let iterator = []
          let roleFilter = []
          await number.map(x => {
    
            if (map.has(x) || message.guild.channels.cache.has(x)) {
              iterator.push(map.get(x) || message.guild.channels.cache.get(x).id)
            }
            if (roleMap.has(x.toLowerCase())) {
              roleFilter.push(roleMap.get(x.toLowerCase()))
            }
    
          })
          let mmt = "";
          for (let [k, v] of map) {
            mmt = mmt + `\`${k}.\` ${v}\n`
          }
    
          let mms = "";
          for (let [k, v] of roleMap) {
            mms = mms + `\`${k}\`: <@&${v}>\n`
          }
    
    
          if (iterator.length == 0 || iterator.length > 5) {
            embede.setDescription(`Lütfen en az 1, en fazla 5 tane kategori seçin.\n\n${mmt}\n${mms}\nÖrnek kullanım:\n\`!top 1 --helper\`\n\`!top 4 1 --helper --support\`\n\`!top <kanalID> --support\`\n\`!top 1 --support 2 --celeste\``)
            return message.channel.send(embede)
          }
    
    
          await data.find({}, async (err, rev) => {
            let numb = 0
            let ast = rev.filter(x => message.guild.members.cache.has(x.user))
            ast = ast.filter(x => !message.guild.members.cache.get(x.user).user.bot)
            if (roleFilter.length > 0) {
              ast = ast.filter(x => roleFilter.some(roleID => message.guild.members.cache.get(x.user).roles.cache.has(roleID)) == true)
            }
            for (let i = 0; i < ast.length; i++) {
              let res = ast[i]
    
              if (!res.state !== "") {
                if (res.channels.has(res.state)) {
                  res.channels.set(res.state, res.channels.get(res.state) + Date.now() - new Date(res.start).getTime())
                } else {
                  res.channels.set(res.state, Date.now() - new Date(res.start).getTime())
                }
              }
              let arre = [];
    
              for (let [k, v] of res.channels) {
    
                if (message.guild.channels.cache.has(k)) {
                  if (v && v > 10000 && isNaN(v) == false) {
                    arre.push({ channel: k, duration: v })
                  }
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
              let toplam = parseInt(kayıt + sorun + publics + stream + activity + fairytale + music + game + secret + sleep)

              async function declare(strname, duration) {
                if (duration / 3600000 > 1) {
                  let val = parseInt(duration / 3600000)
                  let durationn = parseInt((duration - (val * 3600000)) / 60000)
    
                  declarearr.push({ user: res.user, name: strname, duration: duration, message: `\`${val} saat, ${durationn} dakika\`` })
                } else {
                  let durationn = parseInt(duration / 60000)
    
                  declarearr.push({ user: res.user, name: strname, duration: duration, message: `\`${durationn} dakika\`` })
                }
    
              }
              for (let i = 0; i < iterator.length; i++) {
                if (message.guild.channels.cache.has(iterator[i])) {
                  let sleepy = arr.filter(x => x.channel === iterator[i]).map(x => x.duration)
                  declare(message.guild.channels.cache.get(iterator[i]).name, sleepy, true)
                }
              }
    
              await declare("Toplam", toplam, true)
              await declare("Kayıt Odaları", kayıt, false)
              await declare("Ekip Odaları", activity, false)
              await declare("Public Odalar", publics, false)
              await declare("Stream Odaları", stream, false)
              await declare("Secret of Revolution", secret, true)
              await declare("Sleep Room", sleep, false)
              await declare("Sorun Çözme", sorun, true)
              await declare("Oyun Odaları", game, false)
              await declare("Kategorize Edilmemiş", toplam - numb, false)
            }
    
            if (iterator.length == 1) number = 35
            if (iterator.length == 2) number = 17
            if (iterator.length == 3) number = 12
            if (iterator.length == 4) number = 8
            if (iterator.length == 5) number = 7
            let hadi = [];
            let buffertxt = ""
            async function top(string, number) {
              let str;
              if (message.guild.channels.cache.has(string)) {
                str = message.guild.channels.cache.get(string).name
              } else {
                str = string
              }
              let at = declarearr.filter(x => x.name === str).sort(function (a, b) {
                return b.duration - a.duration
              }).map(x => x)
              let find = at.find(x => x.user === message.author.id)
              let buffertxt = ""
              if (find) {
                if (at.indexOf(find) > number - 1) {
                  buffertxt = `${find.user === message.author.id ? "**" : ""} ${at.indexOf(find) + 1}. <@${find.user}>: ${find.message} ${find.user === message.author.id ? "**  (Siz)" : ""}`
                } else {
                  buffertxt = ``
                }
              } else {
                buffertxt = ``
              }
              let ar = at.map(x => `${x.user === message.author.id ? "**" : ""} ${at.indexOf(x) + 1}. <@${x.user}>: ${x.message} ${x.user === message.author.id ? "**  (Siz)" : ""}`).slice(0, number)
              if (buffertxt !== "") ar.push(`${buffertxt}`)
              hadi.push({ name: str, members: ar })
            }
    
            for (let i = 0; i < iterator.length; i++) {
              top(iterator[i], number)
            }
    
            let metin = "";
            for (let i = 0; i < hadi.length; i++) {
              metin = metin + `${hadi[i].name} | Sıralama\n${hadi[i].members.map(x => `${x}`).join("\n")}\n\n Sıralamalar ${roleFilter.map(x => `<@&${x}>`).join(", ")} rolleri arasında gerçekleşmiştir.\n\n`
            }
            message.react("854715939819094017").then(async (m) => {
              async function wait() {
                return new Promise((res, rej) => {
                  setTimeout(() => {
                    embede.setDescription(metin)
                    message.channel.send(embede)
                    message.reactions.removeAll()
                  }, 1500)
                })
              }
              await wait()
            })
    
    
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

module.exports = TOP;
