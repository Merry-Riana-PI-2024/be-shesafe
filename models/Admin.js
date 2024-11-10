const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, Default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
