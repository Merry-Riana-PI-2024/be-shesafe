const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supportSchema = new mongoose.Schema({
  created: { type: Date },
  count: { type: Number },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  casesID: { type: Schema.Types.ObjectId, ref: "Cases" },
  deleted: { type: Date },
});

const Support = mongoose.model("Support", supportSchema);

module.exports = Support;
