const database = require("../models/cantUnBan.js")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild, user) {
    await database.findOne({ user: user.id }, async (err, res) => {
      if (!res) return
      await guild.fetchAuditLogs({
        type: "MEMBER_BAN_REMOVE"
      }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (yapan.id == res.mod) {
          res.delete().catch(e => console.log(e))
          return
        } else {
        guild.members.ban(user, { reason: res.sebep })
        }
      })
    })
  }
};
