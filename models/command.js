const mongoose = require("mongoose");

const commandSchema = mongoose.Schema({
  commandName: String,
  timesUsed: { type: Number, default: 0 },
});

module.exports = mongoose.model("command", commandSchema);