const { Client, Collection, DiscordAPIError } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const mongoose = require("mongoose")
const logs = require("discord-logs");
const Discord = require("discord.js")
const roleBackup = require("./models/roleBackup.js")
class Codesty extends Client {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
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

 ok = "<:ok_wency:854715939819094017>"
 no = "<:no_wency:854715940045717504>"
 serverID = "852194278201360404"
 logChannel = "852194283280662552"
 allowedOwners = ["323301869319618560" , "335115272161853442", "352558230326607873", "223209705814753280", "94238588211822592", "710622150071025704", "263287679767019520"]
 owner = ["335115272161853442", "323301869319618560"]


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

const client = new Codesty();
logs(client);
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

client.login("");
mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true})
.then(client.logger.log("Mongo Bağlantısı Kuruldu ✔", "log"));
};

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

setInterval(() => {
  client.channels.cache.get(client.logChannel).send(`${client.ok} Sunucu rolleri güvenlik amaçlı veri tabanına yedeklendi!`)
  getServerBackup()
}, 900000);

async function getServerBackup() {
  let guild = client.guilds.cache.get(client.serverID)
  if (guild) {
      guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
          let roleChannelOverwrites = []
          guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
              let channelPermissions = c.permissionOverwrites.get(role.id)
              let pushArray = {
                  id: c.id,
                  allow: channelPermissions.allow.toArray(),
                  deny: channelPermissions.deny.toArray()
              };
              roleChannelOverwrites.push(pushArray);
          })
          roleBackup.findOne({
              guildID: client.serverID,
              roleID: role.id
          }, async (err, backupRole) => {
              if (!backupRole) {
                  let roleBackupSchema = new roleBackup({
                      _id: new mongoose.Types.ObjectId(),
                      guildID: client.serverID,
                      roleID: role.id,
                      name: role.name,
                      color: role.hexColor,
                      hoist: role.hoist,
                      position: role.position,
                      permissions: role.permissions,
                      mentionable: role.mentionable,
                      time: Date.now(),
                      members: role.members.map(m => m.id),
                      channelOverwrites: roleChannelOverwrites
                  })
                  roleBackupSchema.save();
              } else {
                  backupRole.name = role.name;
                  backupRole.color = role.hexColor;
                  backupRole.hoist = role.hoist;
                  backupRole.position = role.position;
                  backupRole.permissions = role.permissions;
                  backupRole.mentionable = role.mentionable;
                  backupRole.time = Date.now();
                  backupRole.members = role.members.map(m => m.id);
                  backupRole.channelOverwrites = roleChannelOverwrites;
                  backupRole.save();
              }
          })
      })
      roleBackup.find({
          guilID: client.serverID
      }).sort().exec((err, rolesBackup) => {
          rolesBackup.filter(r => !guild.roles.cache.has(r.roleID) && Date.now() - r.time > 900000).forEach(r => {
              roleBackup.findOneAndDelete({
                  roleID: r.roleID
              })
          })
      })
  }
}


