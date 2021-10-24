const data = require("../models/voicemute.js")

module.exports = client => {
setInterval(async () => {
    let muted = await data.find({
        "muted": true,
        "endDate": {
            $lte: Date.now()
        }
    })
 
    muted.forEach(async memberdata => {
        let sunucu = client.guilds.cache.get(client.config.guildID)
        if (!sunucu) return;
        if(!sunucu.members.cache.has(memberdata.user)) {
            data.deleteOne({user: memberdata.user}, async (err) => {
                if(err){ console.log("Silinemedi.") }
            })
            console.log(`[UNMUTE] ${memberdata.user} bulunamadı`);
        } else {
        let member = sunucu.members.cache.get(memberdata.user) 
        if (!member) return;
        if(!member.voice.channel) return
        member.voice.setMute(false)
        data.deleteOne({user: member.id}, async (err) => {
            if(err){ console.log("Silinemedi.") }
        })
        }
    });
}, 5000);
}