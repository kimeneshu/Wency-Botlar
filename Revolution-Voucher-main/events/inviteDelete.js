module.exports = class {
    constructor(client) {
      this.client = client;
    }

    async run(invite) {
        const newInvites = await invite.guild.fetchInvites()
        await this.client.guildInvıtes.set(invite.guild.id, newInvites)
        this.client.logger.log(`${invite.code} daveti silindi, davet sistemden kaldırıldı!`, "log")
    }
}