const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_waitmute", new mongoose.Schema({
    user: { type: String }, 
    yetkili: {type: String},
    muted: { type: Boolean, default: false},
    sebep: { type: String, default: ""},
    date: { type: Number, default: 0},
    cezano: {type: Number, default: 0}    
}));