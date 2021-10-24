const Command = require("../base/Command.js");
const data = require("../models/yasaklıtag.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
class Yasaklıtag extends Command {
    constructor(client) {
        super(client, {
            name: "yasaklıtag",
            aliases: ["yasaklıtag"]
        });
    }

    async run(message, args, perm) {
        if(!this.client.config.member.guildOwners.includes(message.author.id)) return
        await data.findOne({ guild: message.guild.id }, async (err, res) => {
            if (args[0] == "ekle") {
                if (!args[1]) return this.client.yolla("Yasaklıya atmak istediğin tagı belirtmelisin.", message.author, message.channel)
                if (!res) {
                    let arr = []
                    arr.push(args[1])
                    const newData = new data({
                        guild: message.guild.id,
                        taglar: arr
                    })
                    newData.save().catch(e => console.log(e))
                    let üyeler = message.guild.members.cache.filter(x => {
                        return x.user.username.includes(args[1])
                    })
                    await this.client.yolla("**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsine yasaklı tag permi veriyorum.", message.author, message.channel)
                    this.client.yasaklıtag.push(args[1])
                    üyeler.map(x => {
                        if (x.roles.cache.has(this.client.config.roles.bannedTagRole)) return
                        setTimeout(() => {
                            x.roles.set(x.roles.cache.has(this.client.config.roles.boosterRole) ? [this.client.config.roles.boosterRole, this.client.config.roles.bannedTagRole] : [this.client.config.roles.bannedTagRole])
                        }, 1000)
                    })
                } else {
                    let taglar = res.taglar
                    if (taglar.includes(args[1])) return this.client.yolla("Yasaklıya atmak istediğin tag veritabanında zaten yasaklı.", message.author, message.channel)
                    res.taglar.push(args[1])
                    res.save().catch(e => console.log(e))
                    this.client.yasaklıtag.push(args[1])
                    let üyeler = message.guild.members.cache.filter(x => {
                        return x.user.username.includes(args[1])
                    })
                    await this.client.yolla("**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsine yasaklı tag permi veriyorum.", message.author, message.channel)
                    üyeler.map(x => {
                        if (x.roles.cache.has(this.client.config.roles.bannedTagRole)) return
                        setTimeout(() => {
                            x.roles.set(x.roles.cache.has(this.client.config.roles.boosterRole) ? [this.client.config.roles.boosterRole, this.client.config.roles.bannedTagRole] : [this.client.config.roles.bannedTagRole])
                        }, 1000)
                    })

                }
            }

            if (args[0] == "liste" && !args[1]) {
                if (!res) return await this.client.yolla("Sunucuda yasaklanmış tag bulunmamakta.", message.author, message.channel)
                let num = 1
                let arrs = res.taglar.map(x => `\`${num++}.\` ${x} - (${this.client.users.cache.filter(s => s.username.includes(x)).size} üye)`)
                await this.client.yolla(arrs.join("\n"), message.author, message.channel)
            }

            if (args[0] == "liste" && args[1] == "üye") {
                if (!args[2]) await this.client.yolla("Üyelerini listelemek istediğin yasaklı tagı belirtmelisin.", message.author, message.channel)
                if (!res) return await this.client.yolla("Veritabanında listelenecek yasaklı tag bulunmuyor.", message.author, message.channel)
                if (!res.taglar.includes(args[2])) return await this.client.yolla("**" + res.taglar.join(",") + "** tag(ları) sunucuda yasaklanmış durumdadır. Belirttiğin tag veritabanında bulunmuyor.", message.author, message.channel)
                let üyeler = message.guild.members.cache.filter(x => {
                    return x.user.username.includes(args[2])
                }).map(x => "<@" + x.id + "> - (`" + x.id + "`)")
                let üyelerk = message.guild.members.cache.filter(x => {
                    return x.user.username.includes(args[2])
                }).map(x => "" + x.user.tag + " - (`" + x.id + "`)")
                let text = üyeler.join("\n")
                let texto = üyelerk.join("\n")
                const MAX_CHARS = 3 + 2 + text.length + 3;
                if (MAX_CHARS > 2000) {
                    message.channel.send("Sunucuda çok fazla yasaklı (" + args[2] + ") taga ait kişi var bu yüzden txt olarak göndermek zorundayım.", { files: [{ attachment: Buffer.from(texto), name: "yasakli-tagdakiler.txt" }] });
                } else {
                    message.channel.send(text)
                }
            }

            if (args[0] == "kaldır") {
                if (!res) return await this.client.yolla("Veritabanında kaldırılılacak yasaklı tag bulunmuyor.", message.author, message.channel);
				if (!res.taglar.includes(args[1])) return await this.client.yolla("Belirttiğin tag yasaklı tag listesinde bulunmuyor", message.author, message.channel);
				let üyeler = message.guild.members.cache.filter(x => {
					return x.user.username.includes(args[1]);
				});
				await this.client.yolla("**" + args[1] + "** tagında " + üyeler.size + " kişi bulundu hepsineden yasaklı tag permini alıp sistemden tagı kaldırıyorum.", message.author, message.channel);
				this.client.kaldır(this.client.yasaklıtag, args[1]);
				this.client.kaldır(res.taglar, args[1]);
				res.save().catch(e => console.log(e));
				üyeler.map(x => {
					if(!x.roles.cache.has(this.client.config.roles.bannedTagRole)) return
                    setTimeout(() => {
                        x.roles.set(x.roles.cache.has(this.client.config.roles.boosterRole) ? [this.client.config.roles.boosterRole, this.client.config.roles.unregisterRoles[0]] : [this.client.config.roles.unregisterRoles[0]])
                    }, 1000)				
				});
			}

            if (args[0] == "kontrol") {
                if (!res) return await this.client.yolla("Veritabanında kontrol edilecek yasaklı tag bulunmuyor.", message.author, message.channel)
                res.taglar.forEach(x => {
                    let üye = message.guild.members.cache.filter(mems => {
                        return mems.user.username.includes(x) && !mems.roles.cache.has(this.client.config.roles.bannedTagRole)
                    }).map(x => x.id)
                    message.channel.send(`${x} tagı bulunup <@&866394340972953639> rolü olmayan ${message.guild.members.cache.filter(mems => {
                        return mems.user.username.includes(x) && !mems.roles.cache.has(this.client.config.roles.bannedTagRole)
                    }).size} kişiye rolü veriyorum.`)
                    for (let i = 0; i < üye.length;i++) {
                        setTimeout(() => {
                            message.guild.members.cache.get(üye[i]).roles.set([this.client.config.roles.bannedTagRole])
                        }, (i + 1) * 1000)
                    }
                })
            }
        })
    }
}

module.exports = Yasaklıtag;