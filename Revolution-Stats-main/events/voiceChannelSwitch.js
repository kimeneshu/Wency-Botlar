let database = require("../models/voice.js")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member, oldChannel, newChannel) {

    if (member.user.bot) return;
  database.findOne({ user: member.id }, (err, res) => {
    if (!res) {
      let newBuffer = new database({
        user: member.id,
        channels: new Map([]),
        state: newChannel.id,
        start: Date.now()
      });
      newBuffer.save();
    } else {
      if (res.state === oldChannel.id) {
        if (res.channels.get(oldChannel.id)) {
          res.channels.set(
            oldChannel.id,
            res.channels.get(oldChannel.id) + (Date.now() - res.start)
          );
          res.state = newChannel.id;
          res.start = Date.now();
          res.save();
        } else {
          res.channels.set(oldChannel.id, Date.now() - res.start);
          res.state = newChannel.id;
          res.start = Date.now();
          res.save();
        }
      } else {
        res.state = newChannel.id;
        res.start = Date.now();
        res.save();
      }
    }
  });
  }
};
