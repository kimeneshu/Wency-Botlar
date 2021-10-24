const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_notlar", new mongoose.Schema({
    user: { type: String }, 
    notlar: {type: Array }
}));