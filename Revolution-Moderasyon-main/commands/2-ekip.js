  
const Command = require("../base/Command.js");
const Discord = require("discord.js")
class Ekip extends Command {
    constructor(client) {
        super(client, {
            name: "Ekip",
            aliases: ["team", "ekip"]
        });
    }

    async run(message, args, data) {
        if (!message.member.hasPermission("MANAGE_ROLES")) return;
        let ViaTeam = message.guild.roles.cache.get("866408411620966441")
        let WinnerTeam = message.guild.roles.cache.get("866405655765712947")
        let JustTeam = message.guild.roles.cache.get("856703638277455882")
        let WineTeam = message.guild.roles.cache.get("866408777522610196")
        let ShyTeam = message.guild.roles.cache.get("865253773039239169")
        let ClwTeam = message.guild.roles.cache.get("856703649317257217")
        let Team3003 = message.guild.roles.cache.get("866408969153282089")
        let WitchTeam = message.guild.roles.cache.get("866409719546642453")
        let Team49 = message.guild.roles.cache.get("866058009380913152")
        let teamRoles = message.mentions.roles.first() || message.guild.roles.cache.find(role => role.name === args.join(' ')) || message.guild.roles.cache.get(args[0]);
        if (args[0]) { //
            let mentionRole = message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id)).size
            const Embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true, size: 2048}))
            .setThumbnail(message.guild.iconURL({dynamic: true, size: 2048}))
            .setDescription(`\`-\` ${teamRoles} adlı rol için detaylı bilgilendirme:\n\n\`•\` Toplam bu role sahip üye: **${mentionRole}**\n\`•\` Sunucuda ki aktif üye: **${message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && x.user.presence.status !== "offline").size}**\n\`•\` Sesteki üye sayısı: **${message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && x.voice.channel).size}**\n\`•\` Sunucu sembolüne sahip kullanıcı sayısı: **${message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && x.user.username.includes(this.client.config.tag)).size}**\n\`•\` Seste olmayan aktif kullanıcı sayısı: **${message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && !x.voice.channel && x.user.presence.status !== "offline").size}**\n\`•\` Erkek üye sayısı: **${message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && x.roles.cache.has("852194278334660646")).size}**\n\`•\` Kadın üye sayısı: **${message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && x.roles.cache.has("852194278334660647")).size}**\n───────────────\n\`•\` Ekip üyelerinin seste bulunma oranı: **%${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(teamRoles.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(teamRoles.id)).size * 100)}**`)
            .setColor(message.member.displayHexColor)
            message.channel.send(Embed).then(m => message.react(this.client.ok))
        } else if (!args[0]) {
            const TeamEmbed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true, size: 2048}))
            .setColor(message.member.displayHexColor)
            .addField(`**Star#7730** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${ViaTeam.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(ViaTeam.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(ViaTeam.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(ViaTeam.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(ViaTeam.id)).size * 100)}**`)
            .addField(`**Lêmperouge#1984** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${WinnerTeam.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(WinnerTeam.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(WinnerTeam.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(WinnerTeam.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(WinnerTeam.id)).size * 100)}**`)
            .addField(`**Spect#0667** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${JustTeam.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(JustTeam.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(JustTeam.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(JustTeam.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(JustTeam.id)).size * 100)}**`)
            .addField(`**Evelynn#1131** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${WineTeam.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(WineTeam.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(WineTeam.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(WineTeam.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(WineTeam.id)).size * 100)}**`)
            .addField(`**Witch#1868** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${WitchTeam.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(WitchTeam.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(WitchTeam.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(WitchTeam.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(WitchTeam.id)).size * 100)}**`)
            .addField(`**Shy#1822** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${ShyTeam.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(ShyTeam.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(ShyTeam.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(ShyTeam.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(ShyTeam.id)).size * 100)}**`)
            .addField(`**Swan#3003** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${Team3003.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(Team3003.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(Team3003.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(Team3003.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(Team3003.id)).size * 100)}**`)
            .addField(`**#0049** Adlı ekibin bilgilendirmesi`, `\`•\` Toplam kullanıcı miktarı: **${Team49.members.size}**\n\`•\` Aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(Team49.id) && x.user.presence.status !== "offline").size}**\n\`•\` Seste bulunan aktif kullanıcı miktarı: **${message.guild.members.cache.filter(x => x.roles.cache.has(Team49.id) && x.voice.channel).size}**\n\`•\` Kullanıcıların sağladığı ses oranı: %**${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has(Team49.id) && x.voice.channel).size / message.guild.members.cache.filter(r => r.roles.cache.has(Team49.id)).size * 100)}**`)

            .setFooter(`Seste bulunan kullanıcı oranı: %${parseInt(message.guild.members.cache.filter(x => !x.roles.cache.some(r => ['866058009380913152', '865638240127418410', '865253773039239169' ,'852194278225870861','852194278225870862', '856703611986509836', '856703638277455882', '856703642164527114', '856703645818683393', '856703649317257217', '856703653356503050', '858679404229296178', '858679449260523560'].includes(r.id)) && x.voice.channel).size / message.guild.members.cache.filter(x => x.voice.channel).size * 100)} | Seste bulunan yetkili kullanıcı oranı: %${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has("866402283457478686") && x.voice.channel).size / message.guild.members.cache.filter(x => x.roles.cache.has("866402283457478686")).size * 100)}`)
            message.channel.send(TeamEmbed).then(m => message.react(this.client.ok))
        }
    } //
}
// .setFooter(`Sesteki üye oranı: %${parseInt(message.guild.members.cache.filter(x => !x.roles.cache.has("817782383590768671") && !x.roles.cache.has("811564401877975041") && !x.roles.cache.has("812402604990267483") && !x.roles.cache.has("830124107785699351") && !x.roles.cache.has("831266898389630976") && x.voice.channel).size / message.guild.members.cache.filter(x=>x.voice.channel).size * 100)} | Sesteki yetkili oranı: %${parseInt(message.guild.members.cache.filter(x => x.roles.cache.has("809041964611534867") && x.voice.channel).size / message.guild.members.cache.filter(x=>x.roles.cache.has("809041964611534867")).size * 100)}`)

module.exports = Ekip; //
