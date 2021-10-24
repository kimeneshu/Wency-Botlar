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
    if(!this.client.config.botOwners.includes(message.author.id)) return
    const content = message.content.split(" ").slice(1).join(" ");
    const result = new Promise((resolve, reject) => resolve(eval(content)));

    return result.then((output) => {
        if (typeof output !== "string") {
            output = require("util").inspect(output, {
                depth: 0
            });
        }
        if (output.includes(message.client.token)) {
            output = output.replace(message.client.token, "T0K3N");
        }
        message.channel.send(output, {
            code: "js"
        });
    }).catch((err) => {
        err = err.toString();
        if (err.includes(message.client.token)) {
            err = err.replace(message.client.token, "T0K3N");
        }
        message.channel.send(err, {
            code: "js"
        });
    });

  }
}

module.exports = Eval;