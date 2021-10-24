// This event executes when a new member joins a server. Let's welcome them!
// let tagsayı = this.client.users.cache.filter(user => user.username.includes("⍭")).size + 10
 // (`─────────────────\n${this.client.ok} ${nev} kişisi tagımızı alarak ailemize katıldı.**(Toplam Taglı Üyemiz: ${tagsayı})**\n\nÖnce: \`${old.tag}\`\nSonra: \`${nev.tag}\`\n─────────────────`);
 const Discord = require("discord.js")
module.exports = class {
  constructor (client) {
    this.client = client;
  }

async run (oldUser, newUser) {
  let sunucu = this.client.config.guildID;
  let s = this.client.guilds.cache.get(sunucu).members.cache.get(newUser.id);
  let tag = "✬";
  if (newUser.username.includes(tag)) {
    let tagsayı = this.client.users.cache.filter(user => user.username.includes("✬")).size + 250
    if (!s.roles.cache.get(this.client.config.roles.familyRole)) {
      if (!s.nickname) {
        await s.roles.add(this.client.config.roles.familyRole, "Tagımızı Aldı. Kullanıcı Adı güncellenemedi. ❌"
        );
        this.client.channels.cache.get(this.client.config.channels.joinFamilyLog).send(`${this.client.ok} <@${newUser.id}> adlı üye ( ✬ ) tagını kullanıcı adına yerleştirerek aramıza katıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${tagsayı}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``);
      } else {
        await s.roles.add(this.client.config.roles.familyRole, "Tagımızı Aldı. Kullanıcı Adı güncellendi. ✔️");
        s.setNickname(s.nickname.replace("•", "✬"));
        this.client.channels.cache.get(this.client.config.channels.joinFamilyLog).send(`${this.client.ok} <@${newUser.id}> adlı üye ( ✬ ) tagını kullanıcı adına yerleştirerek aramıza katıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${tagsayı}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``);
      }
    }
  }
  if (!newUser.username.includes(tag)) {
    let tagsayı = this.client.users.cache.filter(user => user.username.includes("✬")).size + 250
    if (s.roles.cache.get(this.client.config.roles.familyRole)) {
      if (!s.nickname) {
        await s.roles.remove(this.client.config.roles.familyRole, "Tagımızı Kaldırdı. Kullanıcı Adı güncellenemedi. ❌");
        this.client.channels.cache.get(this.client.config.channels.leaveFamilyLog).send(`${this.client.no} <@${newUser.id}> adlı üye ( ✬ ) tagını kullanıcı adından silerek aramızdan ayrıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${tagsayı}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``);
      } else {
        await s.roles.remove(this.client.config.roles.familyRole, "Tagımızı Kaldırdı. Kullanıcı Adı güncellendi. ✔️");
        s.setNickname(s.nickname.replace("✬", "•"));
        this.client.channels.cache.get(this.client.config.channels.leaveFamilyLog).send(`${this.client.no} <@${newUser.id}> adlı üye ( ✬ ) tagını kullanıcı adından silerek aramızdan ayrıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${tagsayı}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``);
      }

    let taggesRoles = [
      "852194278384861243",
      "852194278406356992",
      "852194278384861241",
      "852194278384861242",
      "852194278384861240",
      "866406874849345536",
      "871446220101521438",
      "866402283457478686"
    ] // Taglı Rolleri
    
    let authyRoles = [
      '852194278201360405', '852194278356418580', '852194278384861234',
      '852194278384861239', '852194278384861240', '852194278384861241',
      '852194278384861242', '852194278384861243', '852194278406356992',
      '852194278406356993', '852194278406356994', '852194278406356995',
      '852194278406356996', '852194278406356997', '852194278406356998',
      '852194278406356999', '852194278406357000', '852194278423265281',
      '852194278423265282', '852194278423265283', '852194278423265284',
      '852194278423265285', '852194278423265286', '852194278423265287',
      '852194278423265288', '852194278423265289', '852194278423265290',
      '852194278443712542', '852194278443712544', '852194278443712545',
      '852194278443712546', '852194278443712548', '852194278443712549',
      '852194278443712550', '852194278443712551', '852194278461276210',
      '852194278461276212', '871447503801843722', '852194278461276218',
      '871446916284702740', '871447130743636028', '852194278485917762',
      '852194278485917764', '871446743588425748', '852194278507806772',
      '852194278507806777', '852194278519603211', '852194278519603213',
      '852207578264109072', '860612590551171092', '865701340583821333',
      '865701448539832353', '866396941713801228', '866397562532659200',
      '866397791449382942', '866398105864110141', '866398711868555265',
      '871444736832057404', '866399988820738098', '871446386602831922',
      '866401064504393778', '866402283457478686', '866402982035718144',
      '866403348448804904', '871447248670711825', '871447109193318400',
      '871446904490315826', '866405700019421204', '871447307596476566',
      '866405980550987786', '871446220101521438', '866406269245718538',
      '866406486326640681', '866406707063947264', '866408290841788427',
      '866408592877944852', '866415277142573116'
    ] // Yetkili Rolleri
    
    let member = this.client.guilds.cache.get(this.client.config.guildID).members.cache.get(newUser.id)
    let filter = authyRoles.filter(a => member.roles.cache.has(a))
    if (filter.length > 0) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription(`<@${newUser.id}> tag saldığı için aşağıdaki rolleri alındı:\n\n${filter.map(x => `<@&${x}>`).join("\n")}\n\n`)
        this.client.channels.cache.get(this.client.config.channels.authyLeaveLog).send(`<@&852194278519603211>, <@&852194278507806777>, <@&852194278406356997>`, { embed: embed })
        this.client.users.cache.get(oldUser.id).send(`Selam ${oldUser.username}!\n\nGörünüşe göre yetkili ekibimizin bir parçası olarak bulunduğun halde sunucu tagımızı bırakmışsın. Bu sebepten ötürü yetkin otomatik olarak alındı ve bulunduğun yetkili sunucularından otomatik olarak çıkarıldın. Sunucu tagımızı önemsiyoruz ve yetkililerimizde bunu görmek istiyoruz.\n\nBizimle beraber çalıştığın için teşekkürler, seni yeniden aramızda görmekten mutluluk duyacağız. Herhangi bir sorununda veya yetki konusunu yeniden konuşmak için üst yönetim ekibimize yazmaktan çekinme. Seni seviyoruz, iyi ki varsın!\n\nTekrardan görüşmek dileğiyle ve sevgilerle,\nrevolution Yönetim`)
        for (let i = 0; i < filter.length;i++) {
                    setTimeout(() => {
                        member.roles.remove(filter[i])
                    }, (i + 1) * 1000)
                }
    }
    
    let filteruser = taggesRoles.filter(a => member.roles.cache.has(a))
    if (filteruser.length > 0) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription(`<@${newUser.id}> tag saldığı için aşağıdaki rolleri alındı:\n\n${filteruser.map(x => `<@&${x}>`).join("\n")}`)
        this.client.channels.cache.get(this.client.config.channels.authyLeaveLog).send({ embed: embed })
        for (let i = 0; i < filteruser.length;i++) {
                    setTimeout(() => {
                        member.roles.remove(filteruser[i])
                    }, (i + 1) * 1000)
                }
      }
    }
  }
    }
};
// (`─────────────────\n${this.client.ok} ${nev} kişisi tagımızı alarak ailemize katıldı.**(Toplam Taglı Üyemiz: ${tagsayı})**\n\nÖnce: \`${old.tag}\`\nSonra: \`${nev.tag}\`\n─────────────────`);

