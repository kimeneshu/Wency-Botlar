const Command = require("../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
const cezalar = require("../models/cezalar.js")
const Discord = require("discord.js")
const data = require("../models/cezalar.js")
const sunucu = require("../models/sunucu-bilgi.js")
class Temizle extends Command {
    constructor(client) {
        super(client, {
            name: "temizle",
            aliases: ["sil"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.hasPermission("MANAGE_ROLES")) return;
        let amount = args[0];
        if (!amount || isNaN(amount) || parseInt(amount) < 1) {
            return this.client.yolla("Silinecek mesaj sayısını belirtmelisin.", message.author, message.channel)
        }

        await message.delete();
        const user = message.mentions.users.first();

        let messages = await message.channel.messages.fetch({ limit: 100 });
        messages = messages.array();
        if (user) {
            messages = messages.filter((m) => m.author.id === user.id);
        }
        if (messages.length > amount) {
            messages.length = parseInt(amount, 10);
        }
        messages = messages.filter((m) => !m.pinned);
        amount++;
        message.channel.bulkDelete(messages, true);
        if (user) {
            this.client.yolla(`${user} kişisinin **${messages.length}** mesajı sildi.`, message.author, message.channel)
        } else {
            this.client.yolla(`**${messages.length}** mesaj silindi.`, message.author, message.channel)
        }

    }
}

module.exports = Temizle;
