

  const Command = require("../base/Command.js");
const Discord = require("discord.js")
const axios = require('axios')
class banner extends Command {
    constructor(client) {
        super(client, {
            name: "banner",
            aliases: ["user-banner","kbanner"]
        });
    }
 async run(message, args, data) {
    let user = args.length > 0 ? message.mentions.users.first() || await this.client.users.fetch(args[0]) || message.author : message.author
let bannerurl = await bannerURL(user.id,this.client)
    message.channel.send(`${bannerurl}`)
 }
}

module.exports = banner;

async function bannerURL(user, client) {
    const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
    if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
    else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
  }
