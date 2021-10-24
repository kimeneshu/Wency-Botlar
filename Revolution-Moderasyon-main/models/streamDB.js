const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_stream", new mongoose.Schema({
    user: { type: String }, 
    baslangic: { type: Date, default: null},
    channelName: {type: String},
    channelID: {type: String}
}));