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
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|pdf|mp4|mov|mp3|wav|mpeg|ogg/;
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
function uploadToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    if (!mimetype) {
      return reject(new Error('Mimetype is missing or invalid'));
    }

    let resourceType = 'auto';  // Default resource type

    if (mimetype.startsWith("video/")) {
      resourceType = "video";  // Mengupload file video
    } else if (mimetype === "application/pdf") {
      resourceType = "raw";  // Mengupload file PDF
    } else if (mimetype.startsWith("image/")) {
      resourceType = "image";  // Mengupload file gambar
    }else if (mimetype.startsWith("audio/")) {
      resourceType = "raw";  // Mengupload file audio
    }else {
      // Jika mimetype tidak dikenal, kirimkan error
      reject(new Error(`Unsupported file type: ${mimetype}`));
      return;
    }

    // Upload ke Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "journal", 
        resource_type: resourceType,  
      },
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
    console.log("File uploaded:", req.file);
    
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
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
