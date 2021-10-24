const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_cezalı", new mongoose.Schema({
    user: { type: String }, 
    yetkili: {type: String},
    ceza: { type: Boolean, default: false},
    sebep: { type: String, default: ""},
    tarih: { type: String, default: ""}, 
}));