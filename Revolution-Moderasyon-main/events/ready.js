module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    await this.client.wait(1000);
    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);
    require("../modules/unmutes.js")(this.client)
    require("../modules/vunmutes.js")(this.client)
    require("../modules/zamanlayıcı.js")(this.client)
    let guild = this.client.guilds.cache.get(this.client.config.guildID)
    await guild.members.fetch().then(e => console.log('Üyeler fetchlendi.'))
    let botVoiceChannel = this.client.channels.cache.get(this.client.config.channels.botVoiceChannel);
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
    setInterval(() => {
      const customStatus = this.client.config.botStatus
      const reloadStatus = Math.floor(Math.random() * (customStatus.length));
      this.client.user.setActivity(`${customStatus[reloadStatus]}`, { type: "PLAYING"})
    }, 10000);    
    this.client.logger.log(`${this.client.user.tag}, kullanıma hazır ${this.client.users.cache.size} kullanıcı, ${this.client.guilds.cache.size} sunucu.`, "ready");
    this.client.logger.log(`${this.client.lastPunishment} ceza tanımlandı!`, "ready")
  }
};
