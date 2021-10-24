const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_extraMute", new mongoose.Schema({
    user: String, 
    array: Array
}));