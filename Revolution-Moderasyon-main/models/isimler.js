const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_isimler", new mongoose.Schema({
    user: String, 
    isimler: Array
}));