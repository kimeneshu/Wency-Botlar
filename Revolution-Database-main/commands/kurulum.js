const Command = require("../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
const roleData = require('../models/roleBackup.js')

class Kur extends Command {
    constructor(client) {
        super(client, {
            name: "Kur",
            description: "Evaluates arbitrary Javascript.",
            category: "System",
            usage: "eval <expression>",
            aliases: ["setBackup", "kurulum", "kur", "create"]
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
                let newRole = await message.guild.roles.create({
                    data: {
                        name: doc.name,
                        color: doc.color,
                        hoist: doc.hoist,
                        permissions: doc.permissions,
                        position: doc.position,
                        mentionable: doc.mentionable
                    },
                    reason: "Veri tabanındaki bir rol silindiği için tekrardan oluşturuldu!"
                })
                setTimeout(() => {
                    let channelPermissionsData = doc.channelOverwrites;
                    if (channelPermissionsData) channelPermissionsData.forEach((perm, index) => {
                        let chanelID = message.guild.channels.cache.get(perm.id)
                        if (!chanelID) return this.client.logger.log("Böyle bir kanal bulunamadı.", "error")
                        setTimeout(() => {
                            let newChannelData = {}
                            perm.allow.forEach(p => {
                                newChannelData[p] = true
                            })
                            perm.deny.forEach(p => {
                                newChannelData[p] = false
                            })
                            chanelID.createOverwrite(newRole, newChannelData).catch()
                        }, index * 5000);
                    })
                }, 5000);
                let roleMembers = doc.members;
                roleMembers.forEach((member, index) => {
                  let uye = newRole.guild.members.cache.get(member);
                  if (!uye || uye.roles.cache.has(newRole.id)) return;
                  setTimeout(() => {
                    uye.roles.add(newRole.id).catch();
                  }, index*3000);
                })
                this.client.channels.cache.get(this.client.logChannel).send(`\`\`${doc.name} | (${doc.roleID})\`\` Rolü tekrardan oluşturuldu. oluşturan kişi **${message.author.tag}** - ${message.author.id}`)
            } else {
                message.guild.owner.send(`\`\`${doc.name} | (${doc.roleID})\`\` Rolü tekrardan oluşturuldu. oluşturan kişi **${message.author.tag}** - ${message.author.id}`)
            }
        })
    }
}

module.exports = Kur;
