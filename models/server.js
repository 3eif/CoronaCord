const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: String,
  serverName: String,
  prefix: String,
  feed: Array,
});

module.exports = mongoose.model("corona", serverSchema);