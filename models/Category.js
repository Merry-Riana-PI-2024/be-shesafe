const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  created: { type: Date, Default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
