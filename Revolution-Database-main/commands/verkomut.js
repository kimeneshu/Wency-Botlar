const Command = require("../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
const roleData = require('../models/roleBackup.js')

class Kur extends Command {
    constructor(client) {
        super(client, {
            name: "rdağıt",
            description: "Evaluates arbitrary Javascript.",
            category: "System",
            usage: "eval <expression>",
            aliases: ["dağıt"]
        });
    }

    async run(message, args, perm) {
        if(!this.client.owner.includes(message.author.id)) return
        if (!args[0] || isNaN(args[0])) return this.client.yolla(`${this.client.no} Belirtilen rol ID'si geçersiz.`, message.author, message.channel);
        roleData.findOne({
            guildID: this.client.serverID,
            roleID: args[0]
        }, async (err, doc) => {
            if (!doc) {
                this.client.yolla("Belirttiğin rol ID'sine ait bir veri bulunamadı.", message.author, message.channel)
            } else if (doc) {
                let newRole = message.guild.roles.cache.get("866390652250226720")
                let roleMembers = doc.members;
                roleMembers.forEach((member, index) => {
                  let uye = newRole.guild.members.cache.get(member);
                  if (!uye || uye.roles.cache.has(newRole.id)) return;
                  setTimeout(() => {
                    uye.roles.add(newRole.id).catch();
                  }, index*1250);
                })
                message.channel.send(`ok`)
            } else {
                message.guild.owner.send(`\`\`${doc.name} | (${doc.roleID})\`\` Rolü tekrardan oluşturuldu. oluşturan kişi **${message.author.tag}** - ${message.author.id}`)
            }
        })
    } //
}

module.exports = Kur;
