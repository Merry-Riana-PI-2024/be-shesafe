const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const casesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isAnonimous: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  created: { type: Date },
  approved: { type: Date, default: Date.now }, //kasihdefaultnow
  isApproved: { type: String },
  supportCounter: { type: Number },
  commentCounter: { type: Number },
  message: { type: String }, // pesan untuk komunitas diisi oleh user bersifat opsional
  notes: { type: String }, //notes ini diisi oelh admin ketika approve dan bersifat opsional
  journalID: { type: Schema.Types.ObjectId, ref: "Journal", default: "null" },
});

const Cases = mongoose.model("Cases", casesSchema);

module.exports = Cases;
