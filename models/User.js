const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  birthDate: { type: Date, required: true },
  fileIdentity: { type: String, required: true }, //identitasfile
  avatar: { type: String, default: "null" }, //fotoprofil
  isValidated: { type: String },
  validated: { type: Date, default: null }, // Default to null if not immediately validated
  validatedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  created: { type: Date, default: Date.now }, // Set to current date by default
  deleted: { type: Date, default: null },
  edited: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
