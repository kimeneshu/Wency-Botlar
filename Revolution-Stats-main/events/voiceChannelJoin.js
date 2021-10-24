let database = require("../models/voice.js")
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member, channel) {

    if (member.user.bot) return;
    database.findOne({ user: member.id }, (err, res) => {
      if (!res) {
        let newBuffer = new database({
          user: member.id,
          channels: new Map([]),
          state: channel.id,
          start: Date.now()
        });
        newBuffer.save();
      } else {
        res.state = channel.id;
        res.start = Date.now();
        res.save();
      }
    });
  }
};
