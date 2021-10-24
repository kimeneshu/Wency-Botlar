module.exports = class {
    constructor(client) {
      this.client = client;
    }

    async run(invite) {
      const newInvites = await invite.guild.fetchInvites()
      await this.client.guildInvıtes.set(invite.guild.id, newInvites)
      this.client.logger.log(`${this.client.users.cache.get(invite.inviter.id).tag} tarafından ${invite.code} daveti oluşturuldu, davet sisteme tanımlandı!`, "log")
    }
}