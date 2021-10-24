const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_uyarılar", new mongoose.Schema({
   user: String,
   uyarılar: Array,
}));