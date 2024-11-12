require("dotenv").config();
const express = require("express");
const route = express.Router();
const {
  getJournalByIdUser,
  addJournal,
  editJournal,
  deleteJournal,
  getDetailJournal,
  addFile,
  getFile,
  deleteFile,
} = require("../controllers/journal-controller");
const multer = require("multer");
const path = require("path");
const streamifier = require("streamifier");
const { v2: cloudinary } = require("cloudinary");
// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Konfigurasi Multer untuk menyimpan file dalam buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 2MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|pdf|mp4|mov/;
    const extname = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedExtensions.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Fungsi untuk mengunggah file ke Cloudinary menggunakan stream
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "journal" }, // Tentukan folder Cloudinary
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
route.get("/", getJournalByIdUser); //get Journal by id user
route.get("/:id", getDetailJournal); //get Detail journal by id
route.get("/file/:id", getFile);
route.post("/file/:id", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const result = await uploadToCloudinary(req.file.buffer);
    req.body.fileUrl = result.secure_url;
    await addFile(req, res);
  } catch (error) {
    next(error);
  }
});
route.delete("/file/:id", deleteFile); //delete by id
route.post("/", addJournal);
route.put("/:id", editJournal); //edit journal
route.delete("/:id", deleteJournal); //delete by id
module.exports = route;
