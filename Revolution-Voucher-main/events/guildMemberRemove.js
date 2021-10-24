const mongoose = require('mongoose');
const inviteData = require('../models/inviter.js')
module.exports = class {
    constructor(client) {
      this.client = client;
    }
    
    async run(member) {
        let inviterDataX = await inviteData.findOneAndUpdate({ userid: member.id }, {}, { upsert: true, setDefaultsOnInsert: true }).exec();
        if(!inviterDataX) return;
        if(inviterDataX.inviter) {
            await inviteData.updateOne({ userid: inviterDataX.inviter }, { $inc: { "fake": inviterDataX.isFake ? -1 : 0, "regular": inviterDataX.isFake ? 0 : -1, "leave": 1 } }, { upsert: true, setDefaultsOnInsert: true }).exec();
            let inviterData = await inviteData.findOne({ userid: inviterDataX.inviter });
            let fakecount = inviterData.fake;
            let regular = inviterData.regular;
            let bonus = inviterData.bonus;
            this.client.channels.cache.get("852194283028086862").send(`<a:rvt_star:858790966822567966> <@${inviterDataX.inviter}> tarafından davet edilen \`${member.user.tag}\` sunucudan çıktı. (<@${inviterDataX.inviter}> \`${regular + bonus + fakecount}\` toplam davete sahip oldu.)`)
        } else {
            this.client.channels.cache.get("852194283028086862").send(`<a:rvt_star:858790966822567966> \`${member.user.tag}\` sunucudan çıkış yaptı. Veritabanında kullanıcıyı davet eden üye bulunamadı!`)
        }
    }
}