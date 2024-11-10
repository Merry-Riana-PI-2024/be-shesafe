const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const educationSchema = new mongoose.Schema({
  //   id_pengajuan_kasus: { type: String, required: true }, // Link ke specific case
  title: { type: String, required: true },
  file: { type: String, required: true },
  description: { type: String, required: true },
  created: { type: Date, default: Date.now }, // Timestamp saat module dibuat
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true }, // Reference user(admin) yang membuat module
});

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
