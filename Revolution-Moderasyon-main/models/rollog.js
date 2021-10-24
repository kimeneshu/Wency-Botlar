const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_rollog", new mongoose.Schema({
    user: String, 
    roller: Array
}));
