const Discord = require("discord.js");
const axios = require("axios")
const client = new Discord.Client();
const config = require('./config.json')
const ms = require("ms") //
client.rolLimit = new Map(); //
client.kanalKoruma = new Map();
client.rolName = new Map()
client.owners = ["277803523628990465", "817614119204159528", "715496807651737672", "866448970314547207", "335115272161853442", "310779453464772608", "791715250231443558", "225730280894365696", "206498192932601857", "294470361527877632", "805875731510067270", "710235075312222238", "823088558989377536", "710622150071025704", "797802767636496414", "254310472365506570", "223209705814753280", "352558230326607873", "94238588211822592", "520743782992576512", "314235988849459201", "853086442526867497", "204255221017214977", "837775843773906945", "837781105930928179", "837783476102103051", "837823012526882837", "837823301660442624", "838793598425628712", "837823528266235914"]
client.evulate = []
client.channelLimit = new Map()
client.channelName = new Map()
client.blackList = []
client.banLimit = new Map()
client.roleBackup = new Map()
client.roleCreate = new Map()
client.botAccounts = ['837775843773906945', '837781105930928179', '837783476102103051', '837823012526882837', '837823301660442624', '838793598425628712', '837823528266235914']
client.botroles = ["852194278519603213", "856589245074636812"]
client.roleDeleters = ["277803523628990465", "335115272161853442", "310779453464772608", "710622150071025704", "797802767636496414", "223209705814753280", "352558230326607873", "94238588211822592", "823088558989377536", "520743782992576512"]
client.on("ready", () => {
    setInterval(() => {
        const customStatus = ["Revolution ❤️ Wêncy.", "Revolution ❤️ Wêncy.", "Revolution ❤️ Wêncy."]
        const reloadStatus = Math.floor(Math.random() * (customStatus.length));
        client.user.setActivity(`${customStatus[reloadStatus]}`, { type: "PLAYING"})
      }, 10000);
      let botVoiceChannel = client.channels.cache.get("852194280083685416");
      if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
    console.log(client.user.tag)
})
client.on("roleDelete", async (role) => {
    await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let yapan = ayar.executor
        if (client.roleDeleters.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        client.channels.cache.get("852194283280662550").send(`⛔ <@${yapan.id}>(\`${yapan.id}\`) kişisi bir rol sildi ve yasaklandı !`)
        let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        role.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && role.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
            client.roleBackup.set(huh.id, huh.permissions.bitfield)
            huh.setPermissions(0)
        })
        await role.guild.members.ban(yapan.id, { reason: "Rol silmek" })
        client.blackList.push(yapan.id)
    })
});

client.on("guildIntegrationsUpdate", async(guild) => {
	await guild.fetchAuditLogs({ type: "INTEGRATION_DELETE"}).then(async (audit) => {
	let ayar = audit.entries.first()
	let yapan = ayar.executor
	if (Date.now() - ayar.createdTimestamp > 5000) return
    if (client.owners.includes(yapan.id)) return
	client.channels.cache.get("852194283280662550").send(`⛔ <@${yapan.id}>(\`${yapan.id}\`) kişisi entegrasyonlardan bir bot kaldırdı ve yasaklandı!`)
        let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
            client.roleBackup.set(huh.id, huh.permissions.bitfield)
            huh.setPermissions(0)
        })
        await guild.members.ban(yapan.id, { reason: "Bir botu sunucudan kaldırmak!" })
        client.blackList.push(yapan.id)
	})
})

client.on("roleCreate", async (role) => {
    await role.guild.fetchAuditLogs({ type: "ROLE_CREATE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let yapan = ayar.executor
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        let limit = client.roleCreate.get(yapan.id) || [];
        limit.push(role.id);
        client.roleCreate.set(yapan.id, limit);
        if (limit.length == 3) {
        client.channels.cache.get("852194283280662550").send(`⛔ <@${yapan.id}> | (\`${yapan.id}\`) kişisi rol oluşturmaya çalıştığı için yasaklandı roller siliniyor! Açtığı roller \`\`\`${limit.map(x => role.guild.roles.cache.get(x).name).join("\n")}\`\`\``)
        let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        role.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && role.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
           // client.roleBackup.set(huh.id, huh.permissions.bitfield)
            huh.setPermissions(0)
        })
        await role.guild.members.ban(yapan.id, { reason: "Rol açmak" })
        client.blackList.push(yapan.id)
    }
    })
});

client.on("channelDelete", async (channel) => {
    await channel.guild.fetchAuditLogs({ type: "CHANNEL_DELETE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let yapan = ayar.executor
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        client.channels.cache.get("852194283280662550").send(`⛔ <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${channel.name} isimli kanalı sildi ve yasaklandı!`)
        let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        channel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && channel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
          //  client.roleBackup.set(huh.id, huh.permissions.bitfield)
            huh.setPermissions(0)
        })
        await channel.guild.members.ban(yapan.id, { reason: "Kanal silmek" })
        client.blackList.push(yapan.id)
    })
});

client.on("guildUnavailable", async (guild) => {
    let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
    guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
       // client.roleBackup.set(huh.id, huh.permissions.bitfield)
        huh.setPermissions(0)
    })
    client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> Sunucu kullanılamaz hale geldiği için koruma amacıyla yetkileri kapadım!`)
});

client.on("guildMemberAdd", async (member) => {
    if (!member.user.bot) return
    if (!client.botAccounts.includes(member.id)) {
        await member.guild.fetchAuditLogs({ type: "BOT_ADD" }).then(async (audit) => {
            if (!audit) {
                await member.guild.members.ban(member.id, { reason: "Bot izin verilen botlar listesinde bulunmuyor" })
                client.channels.cache.get("852194283280662550").send(`🔑 <@${member.id}> | (\`${member.id}\`) botu sunucuya izinsiz bir şekilde eklendi ve yasaklandı!`)
            }
            let ayar = audit.entries.first()
            let yapan = ayar.executor
            if (client.owners.includes(yapan.id)) return
            if (Date.now() - ayar.createdTimestamp > 5000) return;
            client.channels.cache.get("852194283280662550").send(`🔑 <@${yapan.id}> | (\`${yapan.id}\`) kişisi <@${member.id}> | (\`${member.id}\`) botunu sunucuya izinsiz eklediği için yasaklandı!`)
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
            member.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && member.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                client.roleBackup.set(huh.id, huh.permissions.bitfield)
                huh.setPermissions(0)
            })
            await member.guild.members.ban(yapan.id, "İzinli listesinde olmayan bot eklemek.")
            client.blackList.push(yapan.id)
        })
    }
})

client.on("guildBanAdd", async (guild, member) => {
    await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let yapan = ayar.executor
        let hedef = ayar.target
        if (yapan.id == client.user.id) return
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        let banLimit = client.banLimit.get(yapan.id) || 0
        banLimit++
        client.banLimit.set(yapan.id, banLimit)
        if (banLimit == 3) {
            client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> | (\`${yapan.id}\`) kişisi <@${hedef.id}> | (\`${hedef.id}\`) kişisini sağ tık yöntemiyle yasakladığı için sunucudan yasaklandı!`)
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
            guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                //client.roleBackup.set(huh.id, huh.permissions.bitfield)
                huh.setPermissions(0)
            })
            await guild.members.ban(yapan.id, { reason: "Birden fazla kullanıcıya sağ tık ban işlemi uygulamak" })
            client.blackList.push(yapan.id)
            client.banLimit.delete(yapan.id)
        }
        setTimeout(() => {
            if (client.banLimit.has(yapan.id)) {
                client.banLimit.delete(yapan.id)
            }
        }, ms("1m"))
    })
})

client.on("guildUpdate", async (oldGuild, newGuild) => {
    await newGuild.fetchAuditLogs({ type: "GUILD_UPDATE" }).then(async (audit) => {
        let ayar = audit.entries.first();
        let hedef = ayar.target;
        let yapan = ayar.executor;
        if (yapan.id == client.user.id) return;
        if (client.owners.includes(yapan.id)) return;
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (oldGuild.name !== newGuild.name) {
            newGuild.setName("✬ R E V O L U T I O N")
            newGuild.members.ban(yapan.id, { reason: "Sunucu ismi değiştirmek." })
            client.blackList.push(yapan.id)
            client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> | (\`${yapan.id}\`) kişisi tarafından sunucu ismi değiştirildi. Kişi banlandı, Sunucu ismi eski haline çevirildi.`)
        }
        if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
            newGuild.members.ban(yapan.id, { reason: "Sunucu ÖZEL URL değiştirmek." })
            client.blackList.push(yapan.id)
        }
    })
})

client.on("guildUpdate", async (oldGuild, newGuild) => {
   let url = "rvt"
   if(newGuild.vanityURLCode == url) return
   if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
   let wat = await oldGuild.fetchAuditLogs({type: "GUILD_UPDATE"})
   let yapanpic = oldGuild.members.cache.get(wat.entries.first().executor.id)
   if (client.owners.includes(yapan.id)) return;
   console.log(yapanpic.user.username + " kişisi sunucumuzun özel urlsini değiştirdi.")
   axios({
       method: "patch",
       url: `https://discord.com/api/v6/guilds/${oldGuild.id}/vanity-url`,
       data: {code: url},
       headers: {authorization: `Bot ${client.token}`}
   }).then(() => {
       client.channels.cache.get("852194283280662550").send(`🔐 Sunucu Özel URLsi \`${oldGuild.vanityURLCode}\`, ${yapanpic} | (\`${yapanpic.id}\`) kişisi tarafından değiştirildi. Kişi banlandı, URL eski haline çevirildi.`)
       newGuild.members.ban(yapanpic.id)
   }).catch(e => {
       newGuild.members.ban(yapanpic.id)
       console.error(e)
   })
   }
   })

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    await newMember.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (hedef.id != newMember.id) return
        if (client.owners.includes(yapan.id)) return
        newMember.roles.cache.forEach(async role => {
            if (!oldMember.roles.cache.has(role.id)) {
                let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD"]
                if (arr.some(x => role.permissions.has(x)) == true) {
                    client.channels.cache.get("852194283280662550").send(`📑 <@${yapan.id}> | (\`${yapan.id}\`) kişisi <@${hedef.id}> | (\`${hedef.id}\`) kişisine yetki rolü (\`${role.name}\`) verdiği için yasaklandı!`)
                    await newMember.roles.remove(role)
                    newMember.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newMember.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                        //client.backup.set(huh.id, huh.permissions.bitfield)
                        huh.setPermissions(0)
                    })
                    await newMember.guild.members.ban(yapan.id, "Kişilere yetki rolü tanımlama")
                    client.blackList.push(yapan.id)
                }
            }
        });
    })
})

client.on("roleUpdate", async (oldRole, newRole) => {
    await newRole.guild.fetchAuditLogs({ type: "ROLE_UPDATE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (yapan.id == client.user.id) return
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (oldRole.permissions !== newRole.permissions) {
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD"]
            if (arr.some(x => newRole.permissions.has(x)) == true) {
                client.channels.cache.get("852194283280662550").send(`📑 <@${yapan.id}> | (\`${yapan.id}\`) kişisi rollere yasaklı izin tanıdığı için yasaklandı!`)
                newRole.setPermissions(0);
            }
            newRole.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newRole.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
               // client.backup.set(huh.id, huh.permissions.bitfield)
                huh.setPermissions(0)
            })
            await newRole.guild.members.ban(yapan.id, { reason: "Rollere gereksiz izin tanımak" })
            client.blackList.push(yapan.id)
        }

    })
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    await newChannel.guild.fetchAuditLogs({ type: "CHANNEL_UPDATE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (yapan.id == client.user.id) return
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (oldChannel.name !== newChannel.name) {
            let limitOfChannel = client.channelName.get(yapan.id) || []
            limitOfChannel.push({ channel: newChannel.id, name: oldChannel.name, newName: newChannel.name })
            client.channelName.set(yapan.id, limitOfChannel)
            if (limitOfChannel.length == 2) {
                let mapped = limitOfChannel.map(x => `${x.name} -> ${x.newName}`)
                client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${limitOfChannel.length} kanalın ismini değiştirdiği için yasaklandı.Değiştirmeye çalıştığı kanal isimleri aşağıda belirtilmiştir.\`\`\`${mapped.join("\n")}\`\`\``)
                newChannel.guild.members.ban(yapan.id, { reason: "Kanal isimlerini değiştirmek." })
                client.blackList.push(yapan.id)
                limitOfChannel.map(async (x) => {
                    await newChannel.guild.channels.cache.get(x.channel).setName(x.name)
                })
                let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
                newChannel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newChannel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                  //  client.roleBackup.set(huh.id, huh.permissions.bitfield)
                    huh.setPermissions(0)
                })
                client.channelName.delete(yapan.id)
            }
            setTimeout(() => {
                if (client.channelName.has(yapan.id)) {
                    client.channelName.delete(yapan.id)
                }
            }, ms("30s"))
        }

    })
})

client.on("roleUpdate", async (oldRole, newRole) => {
    await newRole.guild.fetchAuditLogs({ type: "ROLE_UPDATE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (yapan.id == client.user.id) return
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (oldRole.name !== newRole.name) {
            let arr = client.rolName.get(yapan.id) || [];
            await arr.push({ rolid: oldRole.id, rolname: oldRole.name, yeni: newRole.name })
            client.rolName.set(yapan.id, arr)
            if (arr.length == 3) {
                let roles = client.rolName.get(yapan.id)
                let mapped = roles.map(x => `${x.rolname} -> ${x.yeni}`)
                client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> (\`${yapan.id}\`) | <@${yapan.id}> kişisi toplam ${arr.length} rolün ismini değiştirdiği için sunucudan yasaklandı.\n\`\`\`${mapped.join("\n")}\`\`\``)
                newRole.guild.members.ban(yapan.id, { reason: "Rol isimlerini değiştirmek." })
                client.blackList.push(yapan.id)
                let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
                newRole.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newRole.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                    //client.roleBackup.set(huh.id, huh.permissions.bitfield)
                    huh.setPermissions(0)
                })
                roles.map(async (x) => {
                    await newRole.guild.roles.cache.get(x.rolid).setName(x.rolname)
                })
                client.rolName.delete(yapan.id)
            }
            setTimeout(() => {
                if (client.rolName.has(yapan.id)) {
                    client.rolName.delete(yapan.id)
                }
            }, ms("10s"))
        }

    })
});


client.on("message", async message => {
    if (message.content.includes("@everyone") || message.content.includes("@here")) {
        if (message.channel.members.size < 500) return
        if (message.member.roles.cache.some(r => ["852194278519603211"].includes(r.id))) return

        let permissionsForMember = new Discord.Permissions(message.channel.permissionsFor(message.member)).toArray()
        if (permissionsForMember.includes("MENTION_EVERYONE")) {
            await message.guild.members.ban(message.author.id, { reason: "Gereksiz @everyone - @here kullanımı." })
            message.delete().catch(e => console.error(e))
        }
    }
})

client.on("channelCreate", async channel => {
    await channel.guild
        .fetchAuditLogs({ type: "CHANNEL_CREATE" })
        .then(async audit => {
            let ayar = audit.entries.first();
            let yapan = ayar.executor;
            if (yapan.tag == client.user.tag) return;
            if (Date.now() - ayar.createdTimestamp > 5000) return;
            if (client.owners.includes(yapan.id)) return;
            let limit = client.channelLimit.get(yapan.id) || [];
            limit.push(channel.id);
            client.channelLimit.set(yapan.id, limit);
            if (limit.length == 3) {
                client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> | (\`${yapan.id}\`) kişisi toplam 3 kanal açtığı için sunucudan yasaklandı kanallar siliniyor. Açtığı kanallar \`\`\`${limit.map(x => channel.guild.channels.cache.get(x).name).join("\n")}\`\`\``);
                channel.guild.members.ban(yapan.id, { reason: "3 Kanal açma limitini aşmak." })
                client.blackList.push(yapan.id)
                let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
                channel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && channel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                   // client.roleBackup.set(huh.id, huh.permissions.bitfield)
                    huh.setPermissions(0)
                })
                limit.map(async x => {
                    await channel.guild.channels.cache.get(x).delete();
                });
                client.channelLimit.delete(yapan.id);
            }
            setTimeout(() => {
                if (client.channelLimit.has(yapan.id)) {
                    client.channelLimit.delete(yapan.id);
                }
            }, ms("1m"));
        });
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    newChannel.guild.fetchAuditLogs({ type: "CHANNEL_OVERWRITE_UPDATE" }).then(async audit => {
        let ayar = audit.entries.first();
        let yapan = ayar.executor;
        if (yapan.tag == client.user.tag) return;
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (client.owners.includes(yapan.id)) return
        if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
            let everyonePerm = newChannel.permissionOverwrites.filter(p => p.id == newChannel.guild.id).map(x => (x.allow.bitfield));
            let everyonePermission = new Discord.Permissions(everyonePerm[0]).toArray();
            let olDeveryonePerm = oldChannel.permissionOverwrites.filter(p => p.id == newChannel.guild.id).map(x => (x.allow.bitfield));
            let olDeveryonePermission = new Discord.Permissions(olDeveryonePerm[0]).toArray();
            if (olDeveryonePermission.includes("MENTION_EVERYONE" || "MANAGE_CHANNELS")) return;
            if (everyonePermission.includes("MENTION_EVERYONE" || "MANAGE_CHANNELS")) {
                newChannel.guild.members.ban(yapan.id, { reason: "Kanallara gereksiz izin tanımak." })
                client.blackList.push(yapan.id)
                client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${newChannel.name} kanalının everyone izinlerine gereksiz izin tanıdığı için kullanıcı yasaklandı.`);
                newChannel.permissionOverwrites.map(async (x) => await x.delete().then(x => newChannel.overwritePermissions([{ id: newChannel.guild.id, deny: ["VIEW_CHANNEL"] }], "Koruma")));
                let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
                newChannel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newChannel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                 //   client.roleBackup.set(huh.id, huh.permissions.bitfield)
                    huh.setPermissions(0)
                })
            }
        }
    });
});

client.on("guildBanRemove", async (guild, member) => {
    if (!client.blackList.includes(member.id)) return
    await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then(async (audit) => {
        let ayar = audit.entries.first()
        let yapan = ayar.executor
        if (client.owners.includes(yapan.id)) return
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> | (\`${yapan.id}\`) kişisi daha önceden guard tarafından ban yiyen <@${member.id}> | (\`${member.id}\`) kişisinin yasağını kaldırdığı için banlandı !`)
        await guild.members.ban(yapan.id, { reason: "Karalistede bulunan birinin banını açmak" })
        await guild.members.ban(member.id, { reason: "Karalistede olmasına rağmen banı açılmak" })
        client.blackList.push(yapan.id)
    })
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    newChannel.guild.fetchAuditLogs({ type: "CHANNEL_OVERWRITE_UPDATE" }).then(async audit => {
        let ayar = audit.entries.first();
        let yapan = ayar.executor;
        if (yapan.tag == client.user.tag) return;
        if (Date.now() - ayar.createdTimestamp > 4000) return;
        if (client.owners.includes(yapan.id)) return
        if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
            newChannel.guild.members.ban(yapan.id, { reason: "Kanallara gereksiz izin tanımak." })
            client.blackList.push(yapan.id)
            client.channels.cache.get("852194283280662550").send(`<:no_wency:854715940045717504> <@${yapan.id}> kişisi ${newChannel.name} kanalına gereksiz izin tanıdığı için kullanıcı yasaklandı.`);
        }
    });
});

client.on("message", async message => {
    if (message.author.bot) return;
    let izinli = ["310779453464772608", "335115272161853442"]
    if(!izinli.includes(message.author.id)) return
    if (message.channel.type !== "text") return;
    if (!message.guild) return;
    let prefikslerim = [".", "w!", "g1!", "!"];
    let tokuchim = false;
    for (const içindeki of prefikslerim) {
        if (message.content.startsWith(içindeki)) tokuchim = içindeki;
    }
    if (!tokuchim) return;
    const args = message.content.slice(tokuchim.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const event = message.content.toLower;
    const split = message.content.split('"');
    switch (command) {
        case "eval":
            if (args.join(" ").toLowerCase().includes('token')) return message.channel.send("Wow, you're smart.")
            const clean = text => {
                if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else return text;
            }
            try {
                const code = args.join(" ");
                let evaled = await eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
                message.channel.send(clean(evaled), { code: "xl" });
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
            break
    }
    switch (command)  {
        case "güvenli": 
        if (!client.owners.includes(message.author.id)) return
        if (!args[0]) return message.channel.send("Bu komutun kullanım argümasyonu şu şekildedir;\n`.güvenli liste/ekle/çıkar`")
        if (args[0] == "liste") {
        const embed = new Discord.MessageEmbed()
        .setDescription(`**Güvenli üyeler/botlar:**\n${client.owners.map(x => `<@${x}> (\`${x}\`)`).join("\n")}\n\n**Etkilenmeyen roller:**\n${client.botroles.map(x => `<@&${x}>`).join("\n")}`)
        .addField(`▼`, ` \`\`\`Güvenli üye sayısı: ${client.owners.length}\`\`\``, true)
        .addField(`▼`, ` \`\`\`Etkilenmeyen rol sayısı: ${client.botroles.length}\`\`\``, true)
        message.channel.send(embed)
        }
        if (args[0] == "ekle") {
            if (args.length < 1) return message.channel.send("Lütfen güvenliye eklenecek kişiyi doğru belirtiniz.")
            let user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(e => console.log(e))
            if (!user) return message.channel.send("Lütfen güvenliye eklenecek kişiyi doğru belirtiniz.")
            if (client.owners.includes(user.id)) return message.channel.send("<@"+user.id+"> adlı kullanıcı zaten güvenli olarak belirlenmiştir.")
            client.owners.push(user.id)
            message.channel.send("<:ok_wency:854715939819094017> <@"+user.id+"> adlı kullanıcı güvenli kullanıcılar arasına eklenmiştir.")
        } 
         if (args[0] == "kaldır") {
            if (args.length < 1) return message.channel.send("Lütfen güvenliden kaldırılacak kişiyi doğru belirtiniz.")
            let user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(e => console.log(e))
            if (!user) return message.channel.send("Lütfen güvenliden kaldırılacak kişiyi doğru belirtiniz.")
            if (!client.owners.includes(user.id)) return message.channel.send("Güvenli listeden kaldırmak istediğiniz kullanıcı listede bulunmamaktadır.")
            let ownersArray = client.owners.find(x => x === user.id)
            client.owners.splice(client.owners.indexOf(ownersArray), 1)
            message.channel.send("<:ok_wency:854715939819094017> <@"+user.id+"> adlı kullanıcı güvenli kullanıcılar arasından kaldırılmıştır.")
        }
        break
    }
});     

client.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
client.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
client.on("error", e => console.log(e))
client.on("warn", info => console.log(info));

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik Hata: ", errorMsg);
    process.exit(1);
});

process.on("unhandledRejection", err => {
    console.error("Yakalanamayan Hata: ", err);
});

client.login( "" )
