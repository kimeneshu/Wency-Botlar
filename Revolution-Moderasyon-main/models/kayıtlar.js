const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_kayıt", new mongoose.Schema({
   user: String,
   erkek: Number,
   kadın: Number,
   toplam: Number,
   kayıtlar: Array
}));