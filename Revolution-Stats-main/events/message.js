const moment = require("moment")
moment.locale("tr")
const Data = require("../models/messages.js")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.author.bot) return;
    Data.findOne({ user: message.author.id }, (err, res) => {
      if (!res) {
        let map = new Map([]);
        map.set(message.channel.id, 1);
        let newData = new Data({
          user: message.author.id,
          timeout: Date.now(),
          channels: map
        });
        newData.save().catch(e => console.log(e));
      } else {
        let timeout = 10000;
        let asim = res.timeout;
        if (asim !== null && timeout - (Date.now() - asim) > 0) return;
        let önceki = res.channels.get(message.channel.id) || 0;
        res.channels.set(message.channel.id, önceki + 1);
        res.timeout = Date.now();
        res.user = message.author.id;
        res.save().catch(e => console.log(e));
      }
    });

    if (!message.guild) return
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES"))
      return;

    let prefikslerim = ["s?", "r?", "r!"];
    let tokuchim = false;
    for (const içindeki of prefikslerim) {
      if (message.content.startsWith(içindeki)) tokuchim = içindeki;
    }

    if (!tokuchim) return;

    const args = message.content
      .slice(tokuchim.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.guild && !message.member)
      await message.guild.fetchMember(message.author);



    const client = this.client

    const cmd =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command));

    if (!cmd) return;

    if (cmd && !message.guild && cmd.conf.guildOnly) return;


    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }

    this.client.logger.log(
      `${message.author.tag
      } (${message.author.id}) komut kullandı "${cmd.help.name}" kullandığı kanal ${message.channel.name}`,
      "cmd"
    );
    cmd.run(message, args, client);
  }
};
