require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getProfile,
  editProfile,
} = require("../controllers/profile-controller");

const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png/;
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
      { folder: "avatar" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// Route untuk edit profile dengan file upload
const route = express.Router();
route.get("/", getProfile);
route.put("/:id", upload.single("avatar"), async (req, res, next) => {
  try {
    let fileUrl = "";

    // Hanya upload ke Cloudinary jika ada file baru
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      fileUrl = result.secure_url; // URL gambar yang diunggah
    }

    // Menambahkan `fileUrl` ke dalam `req.body` jika ada avatar baru
    req.body.avatar = fileUrl || req.body.avatar;
    await editProfile(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = route;
