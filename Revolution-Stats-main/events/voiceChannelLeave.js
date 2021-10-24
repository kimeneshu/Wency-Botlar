let database = require("../models/voice.js")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member, channel) {

    if (member.user.bot) return;
    database.findOne({ user: member.id }, (err, res) => {
      if (!res) {
        return;
      } else {
        if (res.state === "") return;
  
        if (res.state === channel.id) {
          if (res.channels.get(channel.id)) {
            res.channels.set(
              channel.id,
              res.channels.get(channel.id) + (Date.now() - res.start)
            );
            res.state = "";
            res.start = Date.now();
            res.save();
          } else {
            res.channels.set(channel.id, Date.now() - res.start);
            res.state = "";
            res.start = Date.now();
            res.save();
          }
        } else {
          res.state = "";
          res.start = Date.now();
          res.save();
        }
      }
    });
  }
};
