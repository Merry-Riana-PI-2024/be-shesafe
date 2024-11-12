const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileJournalSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  file: { type: "String" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  journalId: { type: Schema.Types.ObjectId, ref: "Journal" },
  deleted: { type: Date },
});

const FileJournal = mongoose.model("fileJournal", fileJournalSchema);

module.exports = FileJournal;
