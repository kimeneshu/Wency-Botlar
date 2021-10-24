const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")
const ceza = require("../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
class Af extends Command {
  constructor(client) {
    super(client, {
      name: "af",
      usage: "erkek",
      aliases: ["unslave", "cezalı-af"]
    });
  }

  async run(message, args, level) {
		if (!message.member.roles.cache.some(r => this.client.config.roles.jailAuth.includes(r.id)) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return;
      let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
      if (!user) return this.client.yolla("Cezalısını kaldırmak istediğin kullanıcıyı belirt.", message.author, message.channel)
      await cezalar.findOne({ user: user.id }, async (err, doc) => {
          if (!doc) return this.client.yolla("<@" + user + "> veritabanında cezalı olarak bulunmuyor.", message.author, message.channel)
          if (doc.ceza == false) return this.client.yolla("<@" + user + "> veritabanında cezalı olarak bulunmuyor.", message.author, message.channel)
          if(!message.member.roles.cache.has(this.client.config.roles.karantinaDenetim) && message.author.id !== doc.yetkili) return this.client.yolla("🚨 Cezalı af işlemini sadece kişiyi cezalıya atan yetkili (<@"+doc.yetkili+">) gerçekleştirebilir.", message.author, message.channel)
         doc.delete().catch(e => console.log(e))
         user.roles.cache.has(this.client.config.roles.boosterRole) ? user.roles.set([this.client.config.roles.boosterRole, this.client.config.roles.unregisterRoles[0]]) : user.roles.set(this.client.config.roles.unregisterRoles)
         this.client.yolla("Veritabanındaki <@" + user + "> kişinin cezası kaldırıldı.", message.author, message.channel)
    })
  }
}

module.exports = Af;
