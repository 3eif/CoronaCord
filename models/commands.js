const { Schema, model } = require("mongoose");

const Commands = new Schema({
  name: { type: String },
  uid: { type: String },
  gid: { type: String },
  timestamp: { type: String }
});

module.exports = model("commands", Commands);