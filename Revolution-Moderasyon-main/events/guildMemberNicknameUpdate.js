const isimler = require("../models/isimler.js")
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member, oldNickname, newNickname) {
    member.guild.fetchAuditLogs({ type: "GUILD_MEMBER_UPDATE" }).then(async (audit) => {
      let auditLogSchema = audit.entries.first()
      let victimUser = auditLogSchema.executor
      const hook = new Discord.WebhookClient("" + this.client.keys.hookLogs.nameChangeLog + "", "" + this.client.keys.hookLogs.nameChangeLogToken + "");
      const nameChange = new Discord.MessageEmbed()
      .setAuthor(victimUser.tag, victimUser.displayAvatarURL({dynamic: true}))
      .setThumbnail(victimUser.displayAvatarURL({dynamic: true}))
      .setDescription(`${member} üyesinin sunucu içi ismi değiştirildi.\nNick Değişimi:\nÖnce: ${oldNickname ? oldNickname : member.user.username}\nSonra: ${newNickname}\n\`\`\`Kullanıcı: ${member.user.tag} (${member.id}\nYetkili: ${victimUser.tag}\nİsim değiştirilme: ${moment().tz("Europe/Istanbul").format("LLL")}\`\`\``)
      if (!hook) return console.log("Hook kanalı bulunamadı.")
      hook.send(nameChange)
      this.client.channels.cache.get(this.client.config.channels.basicNicknameLog).send(`${this.client.orangeWarn} \`[${moment(Date.now()).add(3,"hour").format("LLL")}]\` ${member} (\`${member.id}\`) adlı üye takma ismini \`${oldNickname ? oldNickname : member.user.username} => ${newNickname ? newNickname : member.displayName}\` olarak değiştirdi.`)
          })   
    }
};