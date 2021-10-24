const { Invite } = require('discord.js');
const mongoose = require('mongoose');
const ms = require('ms');
const inviteData = require('../models/inviter.js')
const moment = require("moment")
require("moment-duration-format")
module.exports = class {
    constructor(client) {
      this.client = client;
    }
//
    async run(member) {
        if(member.bot) return;
        if (Date.now() - member.user.createdTimestamp < ms("1d")) return;
        let fake = Date.now() - member.user.createdTimestamp < ms("5d") ? true : false
        let arr = []
        let InviteCode;
        const cachedInvites = await this.client.guildInvıtes.get(member.guild.id)
        const newInvites = await member.guild.fetchInvites()
        await this.client.guildInvıtes.set(member.guild.id, newInvites)
        try {
          const usedInvite = await newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses)
          if(usedInvite) {
            arr.push(usedInvite.inviter.id)
            InviteCode = usedInvite0
          }
        } catch (err) {
          this.client.logger.log(err, "error")
        }

        if(arr.length > 0) {
          const InviteUser = await this.client.users.fetch(arr[0])
          if(InviteUser.id == member.id) return this.client.channels.cache.get("861562582032056320").send("🎉 Revolution'a hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. \n\nSunucu kurallarımız <#852194278980583447> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber " + member.guild.members.cache.size + " kişi olduk! Sol tarafta bulunan **V. Confirmed** odalarından birine girerek kayıt işlemini gerçekleştirebilirsin."), this.client.channels.cache.get("852194283028086862").send(`<a:rvt_star:858790966822567966> ${member} sunucuya katıldı, kullanıcı kendi kendini davet ettiği için işlem yapılmadı.`)
          InviteCode = `https://discord.gg/${InviteCode}`
          await inviteData.updateOne({ userid: member.id }, { $set: { "inviter": InviteUser.id } }, { upsert: true, setDefaultsOnInsert: true }).exec();
          await inviteData.updateOne({ userid: InviteUser.id }, { $inc: { "fake": fake ? 1 : 0, "regular": fake ? 0 : 1 } }, { upsert: true, setDefaultsOnInsert: true }).exec();
          let inviterData = await inviteData.findOne({ userid: InviteUser.id }).exec();
          let fakes = inviterData.fake || 0;
          let regular = inviterData.regular || 0;
          let bonus = inviterData.bonus || 0;
          let total = regular + bonus + fakes
          this.client.channels.cache.get("861562582032056320").send("🎉 Revolution'a hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. \n\nSunucu kurallarımız <#852194278980583447> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\n<@" + InviteUser.id + "> " + total + ". davetini gerçekleştirerek sunucumuzun " + member.guild.members.cache.size + ". üyesi olmanı sağladı! İyi eğlenceler 🎉🎉🎉")
          this.client.channels.cache.get("852194283028086862").send(`<a:rvt_star:858790966822567966> ${member} kullanıcısı ${InviteUser} tarafından sunucuya davet edildi. (${InviteUser} \`${regular + bonus + fakes}.\` davetine ulaştı.)`)
        } else {
          this.client.channels.cache.get("861562582032056320").send("🎉 Revolution'a hoş geldin <@!" + member + "> !\n\nHesabın " + moment(member.user.createdTimestamp).format("LLL") + " tarihinde (" + moment(member.user.createdTimestamp).fromNow() + ") oluşturulmuş. \n\nSunucu kurallarımız <#852194278980583447> kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n\nSeninle beraber " + member.guild.members.cache.size + " kişi olduk! Sol tarafta bulunan **V. Confirmed** odalarından birine girerek kayıt işlemini gerçekleştirebilirsin."), this.client.channels.cache.get("852194283028086862").send(`<a:rvt_star:858790966822567966> ${member} sunucuya katıldı fakat kimin davet ettiği bulunamadı.`)
        }
        await inviteData.updateOne({ userid: member.id }, { $set: { "isFake": fake} }, { upsert: true, setDefaultsOnInsert: true }).exec();
    }
} //
