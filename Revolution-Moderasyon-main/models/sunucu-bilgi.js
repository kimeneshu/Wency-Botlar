const mongoose = require("mongoose")

const revolution_sunucu = new mongoose.Schema({
   guild: String,
   ihlal: Number
})

module.exports = mongoose.model("revolution_sunucu", revolution_sunucu)