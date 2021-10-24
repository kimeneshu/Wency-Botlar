const roller = require("../models/rollog.js")
const Discord = require("discord.js")
module.exports = class {
    constructor(client) {//
        this.client = client;
    }
    async run(oldMember, newMember) {
        await newMember.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(async (audit) => {
            let log = audit.entries.first()
            if (Date.now() - log.createdTimestamp > 5000) return;
            if (log.target.id != newMember.id) return
            if(this.client.config.member.guildOwners.includes(log.executor.id)) return
            newMember.roles.cache.forEach(async role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    if (this.client.config.roles.bannedRoles.includes(role.id)) {
                        await newMember.roles.remove(role.id)
                        let user = await this.client.users.fetch("223209705814753280")
                        user.send(`${log.executor.tag} tarafından ${newMember.user.tag} kullanıcısına ${role.name} rolü verilmeye çalıştı. Rol geri alındı`)
                    }
                }
            });
    
            oldMember.roles.cache.forEach(async role => {
                if (!newMember.roles.cache.has(role.id)) {
                    if (this.client.config.roles.bannedRoles.includes(role.id)) {
                        await newMember.roles.add(role.id)
                        let user = await this.client.users.fetch("223209705814753280")
                        user.send(`${log.executor.tag} tarafından ${newMember.user.tag} kullanıcısından ${role.name} rolünü almaya çalıştı. Rol geri verildi`)
                    }
                }
            });
        })
        
    }
};
