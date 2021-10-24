const mongoose = require("mongoose")

const revolution_cezalar = new mongoose.Schema({
    user: String,
    ihlal: Number,
    yetkili: String,
    ceza: String,
    tarih: String,
    bitiş: String,
    sebep: String
})

module.exports = mongoose.model("revolution_cezalar", revolution_cezalar)