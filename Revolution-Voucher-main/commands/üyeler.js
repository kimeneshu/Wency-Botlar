const Command = require("../base/Command.js");
const Discord = require("discord.js")
const Database = require('../models/inviter.js');
const inviter = require("../models/inviter.js");
class Üyeler extends Command {
    constructor(client) {
        super(client, {
            name: "inv-log",
            aliases: ["uyeler", "sondavet", "üyeler"]
        });
    }

    async run(message, args) {
        let tokaci = args.length > 0 ? message.mentions.users.first() || await this.client.client_üye(args[0]) || message.author : message.author
        let embed = new Discord.MessageEmbed().setColor(tokaci.displayHexColor).setAuthor(tokaci.displayName, tokaci.displayAvatarURL({dynamic: true}))
        let currentPage = 1;
        Database.find({inviter: tokaci.id}).sort([["descending"]]).exec(async (err, pageArray) => {
            pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userid));
            if (err) this.client.logger.log(err, "error");
            if (pageArray.length) {
                Database.findOne({userid: tokaci.id}, async (err, maviData) => {
                    if (!maviData) maviData = {inviter: null};
                    let inviterMember = this.client.users.cache.get(maviData.inviter) || {id: message.guild.id}
                    this.client.yolla(`${tokaci} üyesini davet eden kullanıcı: ${inviterMember.id == message.guild.id ? message.guild.name : inviterMember.toString()}\n\nDavet ettiği kullanıcı bulunamadı.`, message.author, message.channel)
                });
            } else {
                let pages = pageArray.chunk(10)
                if (!pages.length || !pages[currentPage - 1].length) return this.client.yolla("Sunucuya davet ettiği üye bulunamadı!", message.author, message.channel);
                let msg = message.channel.send(embed);
                let reactions = ["◀", "❌", "▶"];
                for (let reaction of reactions) await msg.react(reaction);
                Database.findOne({userid: tokaci.id}, async (err, maviData) => {
                    let inviterMember = this.client.users.cache.get(maviData.inviter) || {id: message.guild.id};
                    if (msg) await msg.edit(embed.setDescription(`${tokaci} üyesini davet eden kullanıcı: ${inviterMember.id == message.guild.id ? message.guild.name : inviterMember.toString()}\n\n${pages[currentPage - 1].map((kisi, index) => {
                        let memberUser = message.guild.members.cache.get(kisi.userid); return `\`${index+1}.\` ${memberUser.toString()} | ${this.client.tarihHesapla(memberUser.joinedAt)}`;
                    }).join('\n')}`).setFooter(`Şuan ki sayfa: ${currentPage}`)).catch(err => {});
                });
                const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && tokaci.id == message.author.id,
                { time: 20000 }),
                x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && tokaci.id == message.author.id,
                { time: 20000 }),
                go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && tokaci.id == message.author.id,
                { time: 20000 });
                back.on("collect", async reaction => {
                    await reaction.users.remove(message.author.id).catch(err => {});
                    if (currentPage == 1) return
                    currentPage--;
                    if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => {
                        let kisiUye = message.guild.members.cache.get(kisi.userid); return `\`${index+1}.\` ${kisiUye.toString()} | ${this.client.tarihHesapla(kisiUye.joinedAt)}`;
                    })}`).setFooter(`Şuan ki sayfa: ${currentPage}`)).catch(err => {})
                });
                x.on("collect", async reaction => {
                    await back.stop();
                    await go.stop();
                    await x.stop();
                    if (message) message.delete().catch(err => {});
                    if (msg) return msg.delete().catch(err => {});
                });
                back.on("end", async () => {
                    await back.stop();
                    await go.stop();
                    await x.stop();
                    if (message) message.delete().catch(err => {})
                    if (msg) return msg.delete().catch(err => {})
                })
            }
        })

        this.client.tarihHesapla = (date) => {
            const startedAt = Date.parse(date);
            var msecs = Math.abs(new Date() - startedAt);
          
            const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
            msecs -= years * 1000 * 60 * 60 * 24 * 365;
            const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
            msecs -= months * 1000 * 60 * 60 * 24 * 30;
            const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
            msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
            const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
            msecs -= days * 1000 * 60 * 60 * 24;
            const hours = Math.floor(msecs / (1000 * 60 * 60));
            msecs -= hours * 1000 * 60 * 60;
            const mins = Math.floor((msecs / (1000 * 60)));
            msecs -= mins * 1000 * 60;
            const secs = Math.floor(msecs / 1000);
            msecs -= secs * 1000;
          
            var string = "";
            if (years > 0) string += `${years} yıl ${months} ay`
            else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
            else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
            else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
            else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
            else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
            else if (secs > 0) string += `${secs} saniye`
            else string += `saniyeler`;
          
            string = string.trim();
            return `\`${string} önce\``;
          };
          
          Array.prototype.chunk = function(chunk_size) {
            let myArray = Array.from(this);
            let tempArray = [];
            for (let index = 0; index < myArray.length; index += chunk_size) {
              let chunk = myArray.slice(index, index + chunk_size);
              tempArray.push(chunk);
            }
            return tempArray;
          };
          
    }
}

module.exports = Üyeler; 