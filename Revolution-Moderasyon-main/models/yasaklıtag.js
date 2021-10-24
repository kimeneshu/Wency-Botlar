const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_yasaklıtag", new mongoose.Schema({
  guild: String,
  taglar: Array
}));