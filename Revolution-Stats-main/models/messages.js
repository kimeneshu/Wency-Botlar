const mongoose = require("mongoose");

const revolution_messages = mongoose.Schema({
  user: String,
  channels: Map,
  timeout: Number
});

module.exports = mongoose.model("revolution_messages", revolution_messages);
