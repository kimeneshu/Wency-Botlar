const Command = require("../base/Command.js");
class Roller extends Command {
    constructor(client) {
        super(client, {
            name: "rol",
            aliases: ["roller"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return;
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if(!args[0]) return this.client.yolla("Rol bilgisine bakmak istediğin rolü belirt ve tekrar dene !", message.author, message.channel)
        if(!role) return this.client.yolla("Belirtmiş olduğun rolü bulamadım ! Düzgün bir rol etiketle veya ID belirtip tekrar dene.", message.author, message.channel)
        let sayı = role.members.size
        if(sayı > 200) return message.channel.send(`${role} rolünde toplam ${sayı} kişi olduğundan dolayı rol bilgisini yollayamıyorum.`)
        let üyeler = role.members.map(x => `<@${x.id}> - (\`${x.id}\`) `)
        message.channel.send(`- ${role} rol bilgileri;
- Rol Rengi: \`${role.hexColor}\`
- Rol ID: \`${role.id}\`
- Rol Kişi Sayısı: \`${sayı}\`
─────────────────
- Roldeki Kişiler: 
${üyeler.join("\n")}
        `, { split: true })
       
    }
}

module.exports = Roller;
