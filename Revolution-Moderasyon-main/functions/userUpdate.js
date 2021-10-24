const data = require("../models/yasaklıtag.js")


module.exports = class {
	constructor(client) {
	  this.client = client;
	}
  
	async run(old, nev) {
		await data.findOne({ guild: this.client.config.guildID }, async (err, res) => {
		if (old.username !== nev.username) {
		let üye = this.client.guilds.cache.get(this.client.config.guildID).members.cache.get(nev.id)
		if (res.taglar.some(x => nev.username.includes(x)) == true && res.taglar.some(x => old.username.includes(x)) == false && !üye.roles.cache.has(this.client.config.roles.bannedTagRole)) {
		  üye.roles.set(üye.roles.cache.has(this.client.config.roles.boosterRole) ? [this.client.config.roles.boosterRole, this.client.config.roles.bannedTagRole] : [this.client.config.roles.bannedTagRole]).catch(e => console.log(e))
		  üye.send("İsminde bulunan yasaklı tagdan dolayı sunucumuzda yasaklı taga atıldın.İsmindeki yasaklı tagı kaldırarak sunucumuza erişim sağlayabilirsin. Eğer herhangi bir problemin varsa üst yöneticilerimize ulaşmaktan çekinme !").catch(e => console.log(e))
		  this.client.channels.cache.get(this.client.config.channels.bannedTagLogs).send(`❌ ${nev} kişisi sunucumuzda bulunan yasaklı taglardan birini aldı.\n─────────────────\nÖnce: \`${old.tag}\` Sonra: \`${nev.tag}\``);
		}
		if (res.taglar.some(x => nev.username.includes(x)) == false && üye.roles.cache.has(this.client.config.roles.bannedTagRole) && res.taglar.some(x => old.username.includes(x)) == true) {
		  let üye = this.client.guilds.cache.get(this.client.config.guildID).members.cache.get(nev.id)
		  üye.send("İsmindeki yasaklı tagı kaldırdığın için sunucumuzda yasağın kalktı.Teyit odalarından birine girip sunucumuza kaydolabilirsiniz.Seni seviyoruz ve sayıyoruz !").catch(e => console.log(e))
		  this.client.channels.cache.get(this.client.config.channels.bannedTagLogs).send(`✅ ${nev} kişisi sunucumuzda bulunan yasaklı taglardan birini bıraktı.\n─────────────────\nÖnce: \`${old.tag}\` Sonra: \`${nev.tag}\``)
		  üye.roles.set(üye.roles.cache.has(this.client.config.roles.boosterRole) ? [this.client.config.roles.boosterRole, this.client.config.roles.unregisterRoles[0]] : [this.client.config.roles.unregisterRoles[0]]).catch(e => console.log(e))
		}
	  }
	})
	}
  };