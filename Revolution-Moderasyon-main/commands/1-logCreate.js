const Command = require("../base/Command.js");
const Discord = require("discord.js")

class logChannel extends Command {
  constructor(client) {
    super(client, {
      name: "log",
      usage: "log-kur",
      aliases: ["logKur"]
    });
  }
  async run(message, args, level) {
    if(!this.client.config.botOwners.includes(message.author.id)) return
    const parent = await message.guild.channels.create('</> Moderatıon Log', { type: 'category' });
    await message.guild.channels.create('voice-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('join-family', { type: 'text', parent: parent.id });
    await message.guild.channels.create('yasaklı-tag', { type: 'text', parent: parent.id });
    await message.guild.channels.create('booster-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('leave-family', { type: 'text', parent: parent.id });
    await message.guild.channels.create('message-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('invite-tracker', { type: 'text', parent: parent.id });
    await message.guild.channels.create('command-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('yasaklama-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('cezai-işlem-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('moderation-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('command-block', { type: 'text', parent: parent.id });
    await message.guild.channels.create('discord-user-log', { type: 'text', parent: parent.id });
    await message.guild.channels.create('yasak-kaldırma-log', { type: 'text', parent: parent.id });
    message.channel.send(`${this.client.ok} Bot loglarının kurulumu başarıyla tamamlanmıştır.`)
  }
}
  module.exports = logChannel;
