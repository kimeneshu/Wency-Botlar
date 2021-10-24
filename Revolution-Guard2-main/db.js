const mongoose = require("mongoose");

const macabre_guard = mongoose.Schema({
    banlı: Array,
    owner: Array,
    bot: Array
});

module.exports = mongoose.model("macabre Guard", macabre_guard);
