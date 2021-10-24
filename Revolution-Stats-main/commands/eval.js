const Command = require("../base/Command.js");
const moment = require("moment")
require("moment-duration-format")

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "eval <expression>",
      aliases: ["ev"]
    });
  }

  async run (message, args, perm) { 
    let izinli = ["310779453464772608", "335115272161853442"]
    if(!izinli.includes(message.author.id)) return
    if (args.join(" ").toLowerCase().includes('token')) return message.channel.send("Wow, you're smart.")
            const clean = text => {
                if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else return text;
            }
            try {
                const code = args.join(" ");
                let evaled = await eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
               await message.channel.send(clean(evaled), { code: "xl" });
            } catch (err) {
                await message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
  }
}

module.exports = Eval;