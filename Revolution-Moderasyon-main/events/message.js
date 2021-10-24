const moment = require("moment")
const ms = require("ms")
const Discord = require("discord.js")
moment.locale("tr")
const commandDBS = require("../models/vrcRoleCommands")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    const data = {};
    
   // await this.client.selfMessage(message)
   // await this.client.spamMessage(message)
    
    if (message.author.bot && message.author.id !== this.client.user.id) return;
    let commandPass = [".mute"]
    if (message.author.bot && commandPass.some(x => message.content.startsWith(x)) == false) return

    if (message.channel.id == this.client.config.channels.generalChat) {
      if (message.activity !== null) {
        let obje = Object.values(message.activity)
        if (obje.includes(3)) {
          if (message.member.hasPermission("ADMINISTRATOR")) return
          message.delete({
            timeout: 100
          })
          message.channel.send("<@!" + message.author.id + "> Spotify paylaşımlarını genel metin kanalı üstün de paylaşma!").then(msg => msg.delete({
            timeout: 5000
          }))
        }
      }
    }

    if (message.content == "!tag" || message.content == ".tag") {
      message.channel.send("✬")
    }
    if (message.content == "!link") {
      message.channel.send("https://discord.gg/" + this.client.config.guildURL + " <@" + message.author.id + ">")
    }

    var random = [
      "Oha bu çocuk Türk müüüüüüüüüüüü?",
      "dur beynimi çıkarayım, eşit şartlarda konuşalım",
      "gitsen tek kaybım mal kaybı olur hahaha",
      "bunun adı kalp güzelim. Tersten okuduğun gibi plak değil ki sürekli sende takılı kalsın.",
      "kafamı yaşasan kafana sıkarsın",
      "sanırım seni getiren leyleğin bıraktığı izdi, kuş beyinli olman.",
      "senin için savaşırdım ama verimsiz toprakları feth etmeye gerek yok",
      "birbirimizi çift görmem için kaç duble daha içmeliyim?",
      "azrail bile ayağıma geliyor ne bu tripler?",
      "Buralarda yeniyim de kalbinin yolunu tarif eder misin?",
      "Nasıl yani şimdi sen gerçek misin?",
      "Bunca zaman neredeydin ?",
      "seni seviyorum.",
      "Allah seni yaratmış fakat takip etmiyor sanırım, bu tip ne?",
      "sarılalım mı?",
      "benimle evlenir misin?",
      "azıcık beynini kullan diyeceğim fakat seni zor durumda bırakmak istemiyorum.",
      "akıllara zarar bi mükemmelliğin var",
      "attan indiysek leopar falan gelmiştir ben anlamam eşekten",
      "dedikodu yapalım mı?",
      "iyi ki varsın 💕",
      "şu üstteki aptik ne anlatıyor ya?",
      "o kadar haklısın ki... seni öpesim var",
      "öpşuelimi? çabuk!",
      "yavrum hepsi senin mi?",
      "bi alo de gelmezsem gençliğim solsun.",
      "çok şişkosun.",
      "sevgilim var yazma?",
      "zenginsen evlenelim mi?",
      "halk pazarı gibisin canım sana olan tek ilgim ucuzluğundan",
      "o kadar çok meslek türü varken neden şerefsizlik tatlım?",
      "bu güne aynayı öperek başladım",
      "çok bereketli topraklarımız yok mu? her türlü şerefsiz yetişiyor",
      "taş gibisin!",
      "kalitesizliğinin kokusu geldi...",
      "Şey gözlerin çok güzelmiş tanışalım mı ?",
      "Kalbinin yolunu gösterir misin...",
      "Corona olsan bile sana sarılırdım",
      "Oha sen gerçek misin ?",
      "kahveyi sütsüz seni tereddütsüz seviyorum",
      "senin hava attığın yerde benim rüzgarım esiyor",
      "çok güzel bi tablo gördüm tam alacaktım ama aynaymış...",
      "canım haddin hariç her şeyi biliyorsun",
      "havalar alev gibii, tatile serin bi yerlere gitsene mesela morg?",
      "tavla oynayalım ama sen beni tavla",
      "hava sıcak değil aşkından yanıyorum",
      "konum atta belamızı bulalım bebeğim",
      "üşüdüysen sana abayı yakayım mı?",
      "gel biraz otur yanıma ölünce gidersin",
      "sütüm yarım yağlı mutluluğum sana bağlı",
      "eğer ahtapot olsaydım üç kalbimi de sana verirdim",
      "salağa yatarken uyuya falan mı kaldın?",
      "meleksin ama canımı alıyorsun yoksa Azrailim misin?",
      "ben varya fay hattı olsam kesin daha az kırılırdım",
      "iban at hayallerimi yollayayım harcarsın",
      "ankarada deniz sende karakter",
      "sana hayatım diyorum çünkü o kadar kötüsün",
      "görüşelim mi? mahşer yeri uygun mu?",
      "eşekten yarış atı olmaz ama sen genede koş spor yaparsın",
      "Anlatsana biraz neden bu kadar mükemmelsin?",
      "Nasılsın diye sorma bebeğim, sana göreyim kıpss",
      "Kakaolu sütsün seni sevmeyen ölsün",
      "Ya sen hep böyle hoşuma mı gideceksin ?",
      "Çikolatalı keksin bu alemde teksin",
      "8 milyar gülüş varken seninki favorim",
      "dalin gibi kokuyorsun",
      "seni her gün görenlerin şansından istiyorum",
      "en iyisine layıksın yani bana hıh",
      "ateşimin çıkma sebebi corona değil, sensin",
      "yemeğimi yedim şimdi seni yeme vakti",
      "beni biraz takar mısın?",
      "aklın başına gelir ama ben sana gelmem",
      "sen beni birde sevgilinken gör",
      "naber lan karakter kanseri",
      "soğuk davranacaksan üzerime bir şey alayım?",
      "sana beyin alacam",
      "Allah belanı vermiyor artık ben bir şey yapacağım",
      "artık benimsin",
      "o kadar pubg oynadım böyle vurulmadım",
      "canın yandı mı? cenneten düşerken?",
      "seni mumla ararken elektrikler geldi",
      "burnunda sümük var",
      "Suyun içinde klorür senin kalbinde bir ömür...",
      "Çok tatlı olmayı bırak artık... Kalbim başa çıkamıyor !",
      "Kalbini dinle dediklerinde seni dinleyesim geliyor",
      "Polisi arıyorum çünkü bu kadar tatlı olman yasadışı !",
      "Ölüm ani dünya fani bi kere sevsen nolur ki yani ?",
      "Bana yüzünü dönme gece oluyor sanıyorum.",
      "Güneş aya ben sana tutuldum.",
      "Sana gemi alalım dümende bir numarasın.",
      "AÇILIN DÜNYANIN 8.HARİKASI GELDİ !",
      "Ben küçücük bi botum ama sana kocaman sarılırım",
      "Kafam çok güzel çünkü içinde sen varsın.",
      "Alnın güzelmiş yazısı olabilir miyim ?",
      "Gülüşün şimşek içermiyiz birer milkşeyk ?"
    ]
    if (message.channel.id == this.client.config.channels.generalChat) {
      var randomlaananaısikerim =
        random[Math.floor(Math.random() * random.length)];
      let no = Math.floor(Math.random() * 130)
      if (no == 98) {
        message.channel.send("<@" + message.author.id + "> " + randomlaananaısikerim + " ");
      }
    }

    function yuzde(partialValue, totalValue) {
      return (100 * partialValue) / totalValue;
    }

    if (!message.member.hasPermission("MANAGE_ROLES")) {
      if (message.content.length >= 9) {
        let contentCaps = message.content.replace(/[^A-Z]/g, "").length
        let messagePercentage = yuzde(contentCaps, message.content.length)
        if (Math.round(messagePercentage) > 60) {
          let warnCount = this.client.capsBlock.get(message.author.id) || 0
          this.client.capsBlock.set(message.author.id, warnCount + 1)
          if (warnCount >= 4) {
            this.client.yolla("Uyarılarınızdan dolayı susturuldunuz", message.author, message.channel)
            await message.channel.send(`.mute ${message.author} 5m Sunucu içerisinde büyük harf kullanımı abartmak.`)
            await message.delete()
          } else {
            let totalWarnCount = 4 - warnCount
            this.client.yolla("Büyük harf kullanımını azaltın. (> %60)\nKalan uyarı hakkınız: **" + totalWarnCount + "**", message.author, message.channel)
            await message.delete()
          }
          setTimeout(() => {
            this.client.capsBlock.delete(message.author.id)
          }, ms("30s"))
        }
      }
    };

    if (!message.member.hasPermission("MANAGE_ROLES")) {
      const reklam = [`discord.gg`, `.gg/`, `.gg /`, `. gg /`, `. gg/`, `discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`]
      if (reklam.some(word => message.content.toLowerCase().includes(word))) {
        let warnCount = this.client.adBlock.get(message.author.id) || 0
        this.client.adBlock.set(message.author.id, warnCount + 1)
        if (warnCount >= 3) {
          this.client.yolla("Reklam yaptığınız için sunucudan atıldınız.", message.author, message.channel)
          await message.member.kick()
          await message.delete()
        } else {
          let totalWarnCount = 3 - warnCount
          this.client.yolla("Lütfen reklam yapmayınız devam ederseniz sunucudan atılacaksınız. Kalan uyarı hakkınız: **" + totalWarnCount + "**", message.author, message.channel)
          await message.delete()
        }
        setTimeout(() => {
          this.client.adBlock.delete(message.author.id)
        }, ms("30s"))
      }
    }

    let userData = await this.client.findOrCreateUser({ id: message.author.id });
    data.userData = userData;

    let afkReason = data.userData.sebep;
    if (afkReason) {
      let ha = moment(data.userData.tarih).fromNow()
      message.channel.send("<@" + message.author.id + "> AFK modundan başarıyla çıkış yaptın, " + ha + " AFK olmuştun.").then(msg => {
        msg.delete({
          timeout: 7000
        })
      })
    
      let nicke = message.member.displayName.replace("[AFK]", "")
      message.member.setNickname(nicke)
      data.userData.sebep = null;
      data.userData.tarih = 0
      await data.userData.save();

    }

    message.mentions.users.forEach(async (u) => {
      let userData = await this.client.findOrCreateUser({ id: u.id });

      let ha = moment(userData.tarih).fromNow()
      if (userData.sebep) {
        message.channel.send("<@" + userData.id + "> " + ha + " AFK moduna geçti. Sebep: " + userData.sebep + " ").then(msg => {
          msg.delete({
            timeout: 7000
          })
        })
      }
    });

    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES"))
      return;

    let prefikslerim = [".", "!", "r!"];
    let tokuchim = false;
    for (const içindeki of prefikslerim) {
      if (message.content.startsWith(içindeki)) tokuchim = içindeki;
    }

    if (!tokuchim) return;

    const args = message.content
      .slice(tokuchim.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member)
      await message.guild.fetchMember(message.author);



    const client = this.client

    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

    if (!cmd) {
      let res = await commandDBS.findOne({
        cmdName: message.content.split(" ")[0].slice(tokuchim.length)
      })
      if (!res) return
      if (res.allowedRoles.some(x => message.member.roles.cache.has(x)) == false && !res.allowedUsers.includes(message.author.id) && !message.member.roles.cache.has("852194278519603211")) return
      if (res.blockedUsers.includes(message.author.id)) return

      let embed = new Discord.MessageEmbed()
      embed.setColor("RANDOM")
      embed.setAuthor(message.author.tag, message.author.avatarURL({
        dynamic: true
      }))

      let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
      if (!member) {
        embed.setDescription("Bir üye etiketle ve tekrardan dene!")
        return message.channel.send({
          embed: embed
        })
      }

      let role = message.guild.roles.cache.get(res.role)
      if (!role) return

      if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role.id)
        await embed.setDescription(`<@${member.user.id}> üyesine <@&${role.id}> rolü verildi.`)
        await message.channel.send({
          embed: embed
        }).then(m => m.delete({
          timeout: 5000
        }))
        await embed.setDescription(`<@${member.user.id}> üyesine <@&${role.id}> rolü <@${message.author.id}> tarafından verildi.`)
        this.client.channels.cache.get(this.client.config.channels.moderationLogs).send({
          embed: embed
        })
      } else {
        await member.roles.remove(role.id)
        await embed.setDescription(`<@${member.user.id}> üyesinin <@&${role.id}> rolü alındı.`)
        await message.channel.send({
          embed: embed
        }).then(m => m.delete({
          timeout: 5000
        }))
        await embed.setDescription(`<@${member.user.id}> üyesinin <@&${role.id}> rolü <@${message.author.id}> tarafından alındı.`)
        this.client.channels.cache.get(this.client.config.channels.moderationLogs).send({
          embed: embed
        })
      }
      return
    }

    if (!cmd) return;
    if (cmd && !message.guild && cmd.conf.guildOnly) return;


    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }

    if (this.client.blockedFromCommand.includes(message.author.id)) return
    if (!this.client.config.member.guildOwners.includes(message.author.id)) {

      let blockArr = this.client.commandBlock.get(message.author.id) || []

      let datax = {
        içerik: message.content,
        kanal: message.channel.name,
        komut: cmd.help.name
      }

      blockArr.push(datax)

      this.client.commandBlock.set(message.author.id, blockArr)

      if (blockArr.length == 9) {
        message.channel.send(`${message.author}` + "```⛔ Komut kullanımını kötüye kullandığın için engellendi. Açtırmak için ( Tokuchi#1984 / Wêncy.#1984 ) kişisine ulaşman gerekiyor.```")
        this.client.channels.cache.get(this.client.config.channels.commandBlockLog).send(`**${message.author.tag}** - ${message.author} (\`${message.author.id}\`) komut engeli yedi. <@335115272161853442> | Komut kullanım özeti:\n\`\`\`${blockArr.map(x => x.içerik).join("\n")}\nKullandığı komutlar: ${blockArr.map(x => x.komut).join(",")}\nKullandığı kanallar: ${blockArr.map(x => x.kanal).join(",")}\`\`\``)
        this.client.blockedFromCommand.push(message.author.id)
      }

      setTimeout(() => {
        if (this.client.commandBlock.has(message.author.id)) {
          this.client.commandBlock.delete(message.author.id)
        }
      }, ms("1m"))
    }
    this.client.logger.log(`${message.author.tag} (${message.author.id}) komut kullandı "${cmd.help.name}" kullandığı kanal ${message.channel.name}`, "cmd");

    const logMessage = new Discord.WebhookClient("" + this.client.keys.hookLogs.commandLogID + "", "" + this.client.keys.hookLogs.commandLogToken + "");
    logMessage.send(`[\`${moment(Date.now()).add(3,"hour").format("LLL")}\`]🔧 ${message.author.tag} (\`${message.author.id}\`) üyesi ${message.channel.name} kanalında bir komut kullandı: \`${message.cleanContent}\``)
    cmd.run(message, args, data);

  }
};
