const { model, Schema } = require("mongoose");

const feedSchema = new Schema({
  gid: { type: String },
  cid: { type: String },
  countries: { type: Array, default: [] }
});

module.exports = model("feeds", feedSchema);