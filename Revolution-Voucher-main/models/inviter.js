const mongoose = require("mongoose");

module.exports = mongoose.model("revolution_tryINV", new mongoose.Schema({
    userid: String,
    inviter: String,
    isFake: { type: Boolean, default: false },
    regular: { type: Number, default: 0 },
    fake: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    leave: { type: Number, default: 0 }
}));