const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  authorID: String,
  authorName: String,
  commandsUsed: Number,
  blocked: Boolean,
});

module.exports = mongoose.model("users", userSchema);