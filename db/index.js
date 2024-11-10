require("dotenv").config();
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;
const db = mongoose.connect(dbUrl);

module.exports = db;
