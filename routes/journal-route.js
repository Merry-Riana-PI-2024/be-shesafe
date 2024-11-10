require("dotenv").config();
const express = require("express");
const route = express.Router();
const {
  getJournalByIdUser,
  addJournal,
  editJournal,
  deleteJournal,
  getDetailJournal,
} = require("../controllers/journal-controller");
const multer = require("multer");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Konfigurasi Multer-Storage-Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "journal",
    public_id: (req, file) => Date.now() + path.extname(file.originalname),
  },
});

//filter file type
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|mp4|pdf/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //limit 10MB
});

route.get("/", getJournalByIdUser); //get Journal by id user
route.get("/:id", getDetailJournal); //get Detail journal by id
route.post("/", upload.single("file"), addJournal); //add Journal
route.put("/:id", upload.single("file"), editJournal); //edit journal
route.delete("/:id", deleteJournal); //delete by id
module.exports = route;
