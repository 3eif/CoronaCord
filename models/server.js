const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  serverID: { type: String },
  serverName: { type: String },
  prefix: { type: String, default: "c." },
  feed: { type: String, default: [] },
});

module.exports = mongoose.model("settings", serverSchema);