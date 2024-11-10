const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentarSchema = new mongoose.Schema({
  created: { type: Date },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  casesID: { type: Schema.Types.ObjectId, ref: "Cases" },
  deleted: { type: Date },
});

const Commentar = mongoose.model("Commentar", commentarSchema);

module.exports = Commentar;
