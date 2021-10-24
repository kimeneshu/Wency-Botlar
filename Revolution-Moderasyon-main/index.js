const { Client, Collection, DiscordAPIError } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");// //
const mongoose = require("mongoose")
const Discord = require("discord.js")
const cezalar = require("./models/cezalar.js")
const sunucu = require("./models/sunucu-bilgi.js")
const taglar = require("./models/yasaklıtag.js");
const extra = require("./models/extraMute.js")
const user = require("./models/user.js");
const logs = require("discord-logs");
const tokuchi = require("pretty-ms");
const ms = require("ms"); 
const tag = []
class WenchiBot extends Client {
  constructor(options) {
    super(options);
    this.config = require("./config.js");
    this.keys = require("./keys.js");
    this.lastPunishment = 0
    this.adBlock = new Map()
    this.kayıtlar = new Map()
    this.streamWarning = new Map()
    this.channelTime = new Map()
    this.snipe = new Map()
    this.spam = new Map()
    this.banLimit = new Map()
    this.self = new Map([])
    this.jailLimit = new Map()
    this.roleLimit = new Map()
    this.unregisterLimit = new Map()
    this.capsBlock = new Map()
    this.yasaklıtag = []
    this.blockedFromCommand = []
    this.commandBlock = new Map()
    this.commands = new Collection();
    this.aliases = new Collection();
    this.databaseCache = {};
    this.databaseCache.users = new Collection();
    this.databaseCache.guilds = new Collection();
    this.databaseCache.members = new Collection();
    this.usersData = require("./models/user.js")
    this.logger = require("./modules/Logger");
    this.wait = require("util").promisify(setTimeout);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(
        this
      );
      this.logger.log(`Yüklenen Komut: ${props.help.name}. ✔`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Komut yüklenirken hata oluştu: ${commandName}: ${e}`;
    }
  }

  lastCeza = sunucu.findOne({ guild: "852194278201360404" }).then(res => res ? res.ihlal : 0) 

  async savePunishment() {
    sunucu.findOne({ guild: "852194278201360404" }, async (err, res) => {
      if (!res) {
        const newDate = new sunucu({
          guild: "852194278201360404",
          ihlal: 1
        })
        newDate.save().catch(e => console.log(e))
      } else {
        res.ihlal = res.ihlal + 1
        res.save().catch(e => console.log(e))
      }
    })
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command)
      return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[
      require.resolve(`${commandPath}${path.sep}${commandName}.js`)
    ];
    return false;
  }

  ok = "<:wency_ok:866782955581210624>"
  no = "<:wency_no:866782955536121886>"
  muted = "<:rvt_muted:854716138332094505>"
  orangeWarn = "<:orangeWarn:867741773052510248>"
  redWarn = "<:redWarn:867741772896272394>"
  async kaldır(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

    async yolla(mesaj, msg, kanal) {
      if (!mesaj || typeof mesaj !== "string") return
      const embd = new Discord.MessageEmbed()
        .setAuthor(msg.tag, msg.displayAvatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setDescription(mesaj)
      kanal.send(embd).then(msg => {
        msg.delete({ timeout: 15000 })
      })
        .catch(console.error);
    }

    async turkishDate(date) {
      if (!date || typeof date !== "number") return
      let convert = tokuchi(date, { verbose: true })
        .replace("minutes", "dakika")
        .replace("minute", "dakika")
        .replace("hours", "saat")
        .replace("hour", "saat")
        .replace("seconds", "saniye")
        .replace("second", "saniye")
        .replace("days", "gün")
        .replace("day", "gün")
        .replace("years", "yıl")
        .replace("year", "yıl");
      return convert
    }

    async findOrCreateUser({ id: userID }, isLean){
      return new Promise(async (resolve) => {
          if(this.databaseCache.users.get(userID)){
              resolve(isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID));
          } else {
              let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
              if(userData){
                  resolve(userData);
              } else {
                  userData = new this.usersData({ id: userID });
                  await userData.save();
                  resolve((isLean ? userData.toJSON() : userData));
              }
              this.databaseCache.users.set(userID, userData);
          }
      });
  }

  async spamMessage(message) {
    if (this.config.member.guildOwners.includes(message.author.id)) return
    let client = this
    let data = {
        messageID: message.id,
        authorID: message.author.id,
        channelID: message.channel.id,
        content: message.content,
        sentTimestamp: message.createdTimestamp
    }
    if (!client.spam.has(message.author.id)) {
        client.spam.set(message.author.id, {
            messages: [data],
            warncount: 0
        })
    } else {
        client.spam.get(message.author.id).messages.push(data)
    }

    let info = client.spam.get(message.author.id)
    const spamMatches = info.messages.filter((m) => m.content !== message.content && m.sentTimestamp > (Date.now() - 7500))

    let ACTIONS = new Map([
        [1, "30s"],
        [2, "1m"],
        [3, "5m"],
        [4, "10m"],
        [5, "30m"]
    ])

    if (spamMatches.length >= 6) {
        const getContent = function(date) {
            if (!date || typeof date !== "number") return
            let convert = tokuchi(date, {
                    verbose: true
                })
                .replace("minutes", "dakika")
                .replace("minute", "dakika")
                .replace("hours", "saat")
                .replace("hour", "saat")
                .replace("seconds", "saniye")
                .replace("second", "saniye")
                .replace("days", "gün")
                .replace("day", "gün")
                .replace("years", "yıl")
                .replace("year", "yıl");
            return convert
        }
        info.warncount++
        info.messages = []

        let mutetime = ms(ACTIONS.get(info.warncount) || ((info.warncount - ACTIONS.size) * ms("1h")))
        await message.member.roles.add(this.config.roles.chatMutedRole)
        spamMatches.forEach((message) => {
            const channel = client.channels.cache.get(message.channelID)
            if (channel) {
                const msg = channel.messages.cache.get(message.messageID)
                if (msg && msg.deletable) msg.delete()
            }
        })

        setTimeout(() => {
            message.member.roles.remove(this.config.roles.chatMutedRole)
        }, mutetime)
        setTimeout(() => {
            client.spam.get(message.author.id).warncount = client.spam.get(message.author.id).warncount - 1
        }, ms("15m"))

        await message.channel.send(`${this.muted} Sohbet kanallarını kirletme sebebiyle ${getContent(mutetime)} süresince susturuldunuz, mesajlar temizlendi. Lütfen yavaşlayın. <@${message.author.id}>`)
    }
  }

  async selfMessage(message){
    if (this.config.member.guildOwners.includes(message.author.id)) return
    let client = this
    let data = {content: message.content, id: message.id, message: message, channel: message.channel.id};

    if(!client.self.has(message.author.id)){
        client.self.set(message.author.id, {messages: [data], warncount: 0})
    }else{
        client.self.get(message.author.id).messages.push(data)
    }

    let info = client.self.get(message.author.id)
    setTimeout(() => {info.messages.splice(info.messages.indexOf(data), 1)}, 30000)

    let filter = info.messages.filter(a => a.content.toLowerCase() === message.content.toLowerCase())

    let ACTIONS = new Map([
        [1, "30s"],
        [2, "1m"],
        [3, "5m"],
        [4, "10m"],
        [5, "30m"]
    ])

    if(filter.length >= 5){
        const getContent = function(date) {
  if (!date || typeof date !== "number") return
    let convert = tokuchi(date, { verbose: true })
      .replace("minutes", "dakika")
      .replace("minute", "dakika")
      .replace("hours", "saat")
      .replace("hour", "saat")
      .replace("seconds", "saniye")
      .replace("second", "saniye")
      .replace("days", "gün")
      .replace("day", "gün")
      .replace("years", "yıl")
      .replace("year", "yıl");
    return convert
  }
        info.warncount++
        info.messages = []

        let mutetime =  ms(ACTIONS.get(info.warncount) || ((info.warncount - ACTIONS.size) * ms("1h")))
        await message.member.roles.add(this.config.roles.chatMutedRole)
      filter.forEach((message) => {
            const channel = client.channels.cache.get(message.channel)
            if (channel) {
                const msg = channel.messages.cache.get(message.id)
                if (msg && msg.deletable) msg.delete()
            }
        })

        setTimeout(() => {message.member.roles.remove(this.config.roles.chatMutedRole)}, mutetime)
        setTimeout(() => {client.self.get(message.author.id).warncount = client.self.get(message.author.id).warncount - 1}, ms("15m"))

        await message.channel.send(`${this.muted} Spam sebebiyle ${getContent(mutetime)} süresince susturuldunuz. Lütfen yavaşlayın. <@${message.author.id}>`)
    }
  }

  async cezasayı(user) {
    let arr = []
    await cezalar.find({
      user: user
    }, async (err, res) => {
      res.map(x => {
        arr.push(x.ceza)
      })
    })
    return arr.length
  }

  async punishPoint(userID) {
    let res = await cezalar.find({ user: userID })
    if (!res) return 0
    let filterArr = res.map(x => (x.ceza))
    let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
    let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
    let jail = filterArr.filter(x => x == "Cezalı").length || 0
    let ban = filterArr.filter(x => x == "Yasaklı").length || 0
    let uyarı = filterArr.filter(x => x == "Uyarı").length || 0
    let point = (chatMute * 8) + (voiceMute * 10) + (jail * 15) + (ban * 20) + (uyarı * 3)
    return point
  }

  async extraMute(userID, type, time) {
    let res = await extra.findOne({ user: userID })
    if ((!res)) {
      let buffer = new extra({
        __id: new mongoose.Types.ObjectId,
        user: userID,
        array: [{
        type: type,
        attendeAt: Date.now(),
        time: time
        }]
      })
      await buffer.save().catch(e => console.log(e))
      return 0
    }
    if (res.array.length == 0) return 0

    if (res && (res && res.array.filter(a => a.type == type).length == 0)) {
      res.array.push({
        type: type,
        attendeAt: Date.now(),
        time: time
      })
      res.save().catch(e => console.log(e))
      return 0
    }

    let datx = res.array.filter(a => (a.type == type) && (Date.now() - a.attendeAt < ms("12h")) && (a.time == time))
    if (datx.length == 0) return 0

    res.array = res.array.filter(a => Date.now() - a.attendeAt < ms("12h"))

    res.array.push({
      type: type,
      attendeAt: Date.now(),
      time: time
    })
    res.save().catch(e => console.log(e))
    return datx.length
  }

  async clean(text) {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(
        this.token,
        "Njk2MTY4Nz8SDIFDU4OTA1MDk4.b4nug3rc3k.bir.t0k3ns4n4cak.kadarsalagim"
      );

    return text;
  }

  async fetchPunishments() {
    let res = await cezalar.find()
    if (res.length == 0) return 0
    let last = await res.sort((a, b) => { return b.ihlal - a.ihlal })[0]
    return last.ihlal
  }


  async shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  yasaklıtag = tag 


  async üye(search, guild) {
    let member = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^<@!?(\d+)>$/)) {
      let id = search.match(/^<@!?(\d+)>$/)[1];
      member = await guild.members.fetch(id).catch(() => { });
      if (member) return member;
    }
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      guild = await guild.fetch();
      member = guild.members.cache.find(m => m.user.tag === search);
      if (member) return member;
    }
    member = await guild.members.fetch(search).catch(() => { });
    return member;
  }

  async client_üye(search) {
    let user = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      let id = search.match(/^!?([^#]+)#(\d+)$/)[1];
      user = this.users.fetch(id).catch(err => { });
      if (user) return user;
    }
    user = await this.users.fetch(search).catch(() => { });
    return user;
  }
}

const client = new WenchiBot();
const config = require("./config.js")
logs(client);

client.on('ready', () => {
  client.ws.on('INTERACTION_CREATE', async interaction => {
    let name = interaction.data.custom_id
    if (name == ! "class_select_3") return
    let member = await client.guilds.cache.get("871435901732012052").members.fetch(interaction.member.user.id)
    let etkinlik = "871435901732012052"
    let cekilis = "871435901732012052"
    let returnText;
    if (interaction.data.values.includes("couple")) {
      if (!member.roles.cache.has(etkinlik) && member.roles.cache.has(cekilis)) {
        await member.roles.add(etkinlik)
        await member.roles.remove(cekilis)
        returnText = `Rol üzerinize verildi!`
      }
      if (!member.roles.cache.has(etkinlik) && !member.roles.cache.has(cekilis)) {
        await member.roles.add(etkinlik)
        returnText = `Rol üzerinize verildi! ${member}`
      }
      if (!member.roles.cache.has(etkinlik)) {
        await member.roles.remove(etkinlik)
        returnText = `Rol üzerinize verildi! ${member}`
      } else {
        await member.roles.add(etkinlik)
        returnText = `Rol üzerinize verildi! ${member}`
      }

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: returnText,
            flags: "64" // Gizli reply atmak için girmeniz gereken flag
          }
        }
      })
    }
    if (interaction.data.values.includes("alone")) {
      if (!member.roles.cache.has(Alone) && member.roles.cache.has(Lovers)) {
        await member.roles.add(Alone)
        await member.roles.remove(Lovers)
        returnText = `Rol üzerinize verildi! ${member}`
      }
      if (!member.roles.cache.has(Alone) && !member.roles.cache.has(Lovers)) {
        await member.roles.add(Alone)
        returnText = `Rol üzerinize verildi! ${member}`
      }
      if (!member.roles.cache.has(Alone)) {
        await member.roles.remove(Alone)
        returnText = `Rol üzerinize verildi! ${member}`
      } else {
        await member.roles.add(Alone)
        returnText = `Rol üzerinize verildi! ${member}`
      }

      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: returnText,
            flags: "64" // Gizli reply atmak için girmeniz gereken flag
          }
        }
      })
    }

  });

  client.ws.on('INTERACTION_CREATE', async interaction => {
    let name = interaction.data.custom_id
    if (name == ! "class_select_3") return
    let member = await client.guilds.cache.get("852194278201360404").members.fetch(interaction.member.user.id)
    if (interaction.data.values.includes("amongus") || interaction.data.values.includes("spec") || interaction.data.values.includes("dc") || interaction.data.values.includes("vk")) {
    let returnText = `${member}, aşağıdaki roller başarıyla üstünüze eklendi:\n\n`
    if (interaction.data.values.includes("amongus")) {
      if(!member.roles.cache.has("852194278305693733")) {
        member.roles.add("852194278305693733")
        returnText += "• Among Us\n"
      } 
    }
    if (interaction.data.values.includes("dc")) {
      if(!member.roles.cache.has("852194278305693732")) {
        member.roles.add("852194278305693732")
        returnText += "• Doğruluk Cesaret\n"
      } 
    }
    if (interaction.data.values.includes("vk")) {
      if(!member.roles.cache.has("852194278305693731")) {
        member.roles.add("852194278305693731")
        returnText += "• Vampir Köylü\n"
      } 
    }
    if (interaction.data.values.includes("spec")) {
      if(!member.roles.cache.has("852194278305693734")) {
        member.roles.add("852194278305693734")
        returnText += "• Film İzleyicisi\n"
      } 
    }
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: returnText,
          flags: "64" // Gizli reply atmak için girmeniz gereken flag
        }
      }
    })
  }
  });

});

client.on('ready', () => {
  client.ws.on('INTERACTION_CREATE', async interaction => {
    let name = interaction.data.custom_id
    let member = await client.guilds.cache.get("852194278201360404").members.fetch(interaction.member.user.id)
    let returnTextx = `${member}, aşağıdaki roller başarıyla üstünüzden kaldırıldı:\n\n`
    if (interaction.data.values.includes("crawler")) {
      if(member.roles.cache.has("852194278305693733")) {
        member.roles.remove("852194278305693733")
        returnTextx += "• Among Us\n"
      } 
    }
    if (interaction.data.values.includes("wency")) {
      if(member.roles.cache.has("852194278305693732")) {
        member.roles.remove("852194278305693732")
        returnTextx += "• Doğruluk Cesaret\n"
      } 
    }
    if (interaction.data.values.includes("pasam")) {
      if(member.roles.cache.has("852194278305693731")) {
        member.roles.remove("852194278305693731")
        returnTextx += "• Vampir Köylü\n"
      } 
    }
    if (interaction.data.values.includes("davies")) {
      if(member.roles.cache.has("852194278305693734")) {
        member.roles.remove("852194278305693734")
        returnTextx += "• Film İzleyicisi\n"
      } 
    }
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: returnTextx,
          flags: "64" // Gizli reply atmak için girmeniz gereken flag
        }
      }
    })

  });
})

client.on('ready', () => {
  client.ws.on('INTERACTION_CREATE', async interaction => {
      
      let name = interaction.data.custom_id

      let GameMap = new Map([
          ["buttonvk","866394567951122452"],
          ["buttondc","866395708050243585"]
      ])

      let member = await client.guilds.cache.get("852194278201360404").members.fetch(interaction.member.user.id)
      if(!GameMap.has(name) || !member) return;

      let role = GameMap.get(name)
      let returnText;

      if(member.roles.cache.has(role)){
          await member.roles.remove(role)
          returnText = `Rol üzerinizden alındı.`
      }else{
          await member.roles.add(role)
          returnText = `Rol üzerinize verildi.`

      }
      
      client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
              type: 4,
              data: {
                  content: returnText,
                  flags: "64" // Gizli reply atmak için girmeniz gereken flag
              }
          }
      })
      
  });
});

const init = async () => {
  klaw("./commands").on("data", item => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(
      cmdFile.dir,
      `${cmdFile.name}${cmdFile.ext}`
    );
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Toplam ${evtFiles.length} event yükleniyor.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Yüklenen Event: ${eventName} ✔`);
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  const evtFilesx = await readdir("./functions/");
  client.logger.log(`Toplam ${evtFilesx.length} yedek event yükleniyor.`, "log");
  evtFilesx.forEach(file => {
    const eventNamez = file.split(".")[0];
    client.logger.log(`Yüklenen Yedek Event: ${eventNamez} ✔`);
    const eventz = new (require(`./functions/${file}`))(client);
    client.on(eventNamez, (...args) => eventz.run(...args));
    delete require.cache[require.resolve(`./functions/${file}`)];
  });

  client.login(client.keys.token);
  mongoose.connect(client.keys.mongoose, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client.logger.log("Mongo Bağlantısı Kuruldu ✔", "log"));
};

client.on("ready", () => {
  taglar.findOne({guild: config.guildID}, async (err,res) => { 
    if(!res) return
    res.taglar.map(x => {
      tag.push(x)
    })
  })
})
init();

client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));


process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Promise Hatası: ", err);
});
