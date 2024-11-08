require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addModule,
  getAllModule,
  getEditModule,
  deleteModule,
} = require("../controllers/admedu-controller");

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
    folder: "edukasi",
    public_id: (req, file) => Date.now() + path.extname(file.originalname),
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedExtensions.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const route = express.Router();

route.post("/", upload.single("file"), addModule);
route.get("/", getAllModule);
route.put("/", getEditModule);
route.delete("/", deleteModule);

module.exports = route;
