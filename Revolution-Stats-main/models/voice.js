const mongoose = require("mongoose");

const revolution_voiceStat = mongoose.Schema({
  user: String,
  channels: Map,
  state: String,
  start: Number
});

module.exports = mongoose.model("revolution_voiceStat", revolution_voiceStat);
