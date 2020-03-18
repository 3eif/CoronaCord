const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  image: { type: Array, default: [] },
  timestamp: { type: Number },
  year: { type: Number },
  month: { type: Number },
  date: { type: Number }
});

module.exports = mongoose.model("datasets", serverSchema);