const roller = require("../models/rollog.js")
const Discord = require("discord.js")
module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(oldMember, newMember) {
        await newMember.guild.fetchAuditLogs({
            type: "MEMBER_ROLE_UPDATE"
        }).then(async (audit) => {
            let ayar = audit.entries.first()
            let hedef = ayar.target
            let yapan = ayar.executor
            if (yapan.bot) return
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    const emed = new Discord.MessageEmbed()
                        .setAuthor(hedef.tag, hedef.displayAvatarURL({ dynamic: true }))
                        .setColor("RANDOM")
                        .setDescription(`${this.client.ok} ${hedef} - (\`${hedef.id}\`) kişisine rol eklendi!`)
                        .addField("Ekleyen Kişi", `${yapan} - (\`${yapan.id}\`)`, false)
                        .addField("Eklenen Rol", `${role}`, false)
                        .setFooter(yapan.tag, yapan.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                    this.client.channels.cache.get(this.client.config.channels.moderationLogs).send(emed)
                    roller.findOne({
                        user: hedef.id
                    }, async (err, res) => {
                        if (!res) {
                            let arr = []
                            arr.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                    timeZone: "Asia/Istanbul"
                                })),
                                state: "Ekleme"
                            })
                            let newData = new roller({
                                user: hedef.id,
                                roller: arr
                            })
                            newData.save().catch(e => console.log(e))
                        } else {
                            res.roller.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                    timeZone: "Asia/Istanbul"
                                })),
                                state: "Ekleme"
                            })
                            res.save().catch(e => console.log(e))
                        }
                    })
                }
            });
            oldMember.roles.cache.forEach(async role => {
                if (!newMember.roles.cache.has(role.id)) {
                    const emeed = new Discord.MessageEmbed()
                        .setAuthor(hedef.tag, hedef.displayAvatarURL({ dynamic: true }))
                        .setColor("RANDOM")
                        .setDescription(`${this.client.no} ${hedef} - (\`${hedef.id}\`) kişisinden rol alındı!`)
                        .addField("Alan Kişi", `${yapan} - (\`${yapan.id}\`)`, false)
                        .addField("Alınan Rol", `${role}`, false)
                        .setFooter(yapan.tag, yapan.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                    this.client.channels.cache.get(this.client.config.channels.moderationLogs).send(emeed)
                    roller.findOne({
                        user: hedef.id
                    }, async (err, res) => {
                        if (!res) {
                            let arr = []
                            arr.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                    timeZone: "Asia/Istanbul"
                                })),
                                state: "Kaldırma"
                            })
                            let newData = new roller({
                                user: hedef.id,
                                roller: arr
                            })
                            newData.save().catch(e => console.log(e))
                        } else {
                            res.roller.push({
                                rol: role.id,
                                mod: yapan.id,
                                tarih: Date.parse(new Date().toLocaleString("tr-TR", {
                                    timeZone: "Asia/Istanbul"
                                })),
                                state: "Kaldırma"
                            })
                            res.save().catch(e => console.log(e))
                        }
                    })
                }
            });
        })
    }
};
