require("dotenv").config();
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL;

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
};

const db = mongoose
  .connect(dbUrl, dbOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

module.exports = db;
