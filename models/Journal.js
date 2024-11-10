const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
  file: { type: String, required: false, default: null },
  created: { type: Date, default: Date.now }, // Set default to current date
  deleted: { type: Date, default: null },
  edited: { type: Date, default: null },
  createdBy: { type: mongoose.ObjectId, ref: "User" }, // No default here since it's a reference
});

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
