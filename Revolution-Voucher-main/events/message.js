const moment = require("moment")
const ms = require("ms")
const Discord = require("discord.js")
moment.locale("tr")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;
    let prefikslerim = [".", "!", "r.", "R.", "r!", "R!"];
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
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;
    if (cmd && !message.guild && cmd.conf.guildOnly) return;
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    this.client.logger.log(`${message.author.tag} (${message.author.id}) komut kullandı "${cmd.help.name}" kullandığı kanal ${message.channel.name}`, "cmd");
    cmd.run(message, args);
  }
};
