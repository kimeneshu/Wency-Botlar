module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run (member, channel) {
        if (!this.client.config.channels.streamChannels.includes(channel.id)) return
        if (!member.displayName.includes("|")) return
        let memberAge = member.displayName.split("|")[1]
        if (isNaN(memberAge)) return
        if (memberAge < 18) {
            let warningCount = this.client.streamWarning.get(member.id) || 1
            this.client.streamWarning.set(member.id, warningCount + 1)
            this.client.channels.cache.get(this.client.config.channels.streamPunitiveLogs).send(`${this.client.no} ${member} üyesi **18 Yaşından** küçük olmasına rağmen +18 kanallara giriş yaptığı için kanaldan atıldı! Giriş yaptığı kanal \`${channel.name}\``)
            if(member.voice.channel) {
                setTimeout(() => {
                    member.voice.kick()
                }, 5000)
            } 
            if (warningCount >= 3) {
                member.roles.add(this.client.config.roles.streamPunitive)
                if(member.voice.channel) {
                    setTimeout(() => {
                        member.voice.kick()
                    }, 5000);
                }
                this.client.channels.cache.get(this.client.config.channels.streamPunitiveLogs).send(`${this.client.no} ${member} üyesi **18 Yaşından** küçük olmasına rağmen +18 kanallara 3 kez giriş yaptığı için sunucumuzda \`Streamer Cezalı\` rolü verildi! Giriş yaptığı kanal \`${channel.name}\``)
            }
            setTimeout(() => {
                if (this.client.streamWarning.has(member.id)) {
                    this.client.streamWarning.delete(member.id)
                }
            }, 60000)
        }   
    }
}