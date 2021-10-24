const data = require("../models/alarm.js")

module.exports = client => {
    setInterval(async () => {
        let muted = await data.find({
            "alarm": true,
            "endDate": {
                $lte: Date.now()
            }
        })

        muted.forEach(async memberdata => {
            let sunucu = client.guilds.cache.get(client.config.guildID)
            if (!sunucu) return;
            let member = sunucu.members.cache.get(memberdata.user) || await sunucu.members.fetch(memberdata.user).catch((err) => {
                data.deleteOne({ user: memberdata.user }, async (err) => {
                    if (err) { console.log("Silinemedi") }
                })
                console.log(`[ALARM] ${memberdata.user} bulunamadı`);
                console.log(err)
            });
            if (!member) return;
            let kanal = sunucu.channels.cache.get(memberdata.channel)
            kanal.send(":alarm_clock: | <@!" + member + "> **" + memberdata.sebep + "** sebebi ile alarm kurmamı istemiştin.")
            let mem = sunucu.members.cache.get(memberdata.user)
            mem.send(":alarm_clock: | <@!" + member + "> **" + memberdata.sebep + "** sebebi ile alarm kurmamı istemiştin.")
            data.deleteOne({ user: memberdata.user }, async (err) => {
                if (err) { console.log("Silinemedi") }
            })
        });
    }, 5000);
}