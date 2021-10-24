const mongoose = require("mongoose")

const vrcRoleCommands = mongoose.Schema({
cmdName: String,
allowedRoles: Array,
role: String,
blockedUsers: Array,
allowedUsers: Array
});

module.exports = mongoose.model("vrcRoleCommands", vrcRoleCommands)