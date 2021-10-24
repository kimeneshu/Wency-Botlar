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
    
    this.client.guilds.cache.forEach(guildStarlite => {
      guildStarlite.fetchInvites().then(starliteInvites => {
          this.client.guildInvıtes.set(guildStarlite.id, starliteInvites);
          this.client.logger.log(`${guildStarlite.name} davetleri tanımlandı ✔`, "ready")
      }).catch(err => { this.client.logger.log("Davetler tanımlanamadı.", "ready") });
    });
    
    let botVoiceChannel = this.client.channels.cache.get("809143577190858832");
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
    setInterval(() => {
      const customStatus = ["Revolution ❤️ Wêncy.", "Revolution ❤️ Wêncy.", "Revolution ❤️ Wêncy."]
      const reloadStatus = Math.floor(Math.random() * (customStatus.length));
      this.client.user.setActivity(`${customStatus[reloadStatus]}`, { type: "PLAYING"})
    }, 10000);
    this.client.logger.log(`${this.client.user.tag}, kullanıma hazır ${this.client.users.cache.size} kullanıcı, ${this.client.guilds.cache.size} sunucu.`, "ready");
  }
};
