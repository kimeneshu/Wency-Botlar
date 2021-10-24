const Command = require("../base/Command.js");
class AFK extends Command {
    constructor(client) {
        super(client, {
            name: "afk",
            aliases: ["afk"]
        });
    }

    async run(message, args, data) {
if(message.member.displayName.includes("[AFK]")) return
        let reason = message.cleanContent.slice(5)
        if(!reason) reason = "Şu an AFK olabilirim... Ama döneceğim !"
        let regex = /h?t?t?p?s?:?\/?\/?discord.?gg\/?[a-zA-Z0-9]+/
let regexSecond = /h?t?t?p?s?:?\/?\/?discorda?p?p?.?com\/?invites\/?[a-zA-Z0-9]+/
if(regex.test(message.content) == true || regexSecond .test(message.content) == true) return
        if(message.content.includes("@here") || message.content.includes("@everyone") || message.content.includes("<@&852194278201360404>") || message.content.includes("852194278201360404")) return
        message.member.setNickname("[AFK] " + message.member.displayName)
        message.reply("Başarıyla AFK moduna geçtin ve mesajını şu şekilde ayarladım **"+reason+"**.").then(msg => { msg.delete({ timeout: 7000 }) })
        data.userData.sebep = reason;
        data.userData.tarih = Date.now()
        data.userData.save();
    }
}

module.exports = AFK;