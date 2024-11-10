require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  checkAuth: (req, res) => {
    if (req.user) {
      return res.status(200).json({ isAuthenticated: true, user: req.user });
    }
    return res.status(401).json({ isAuthenticated: false });
  },

  regist: async (req, res) => {
    // Mendapatkan data dari body request
    const { fullName, email, gender, password, birthDate, fileUrl } = req.body;

    // Validasi input
    if (!fullName) {
      return res
        .status(400)
        .json({ message: "Nama lengkap tidak boleh kosong" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email tidak boleh kosong" });
    }

    if (!gender) {
      return res
        .status(400)
        .json({ message: "Jenis kelamin tidak boleh kosong" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password tidak boleh kosong" });
    }

    if (!birthDate) {
      return res
        .status(400)
        .json({ message: "Tanggal lahir tidak boleh kosong" });
    }

    // Validasi email (Format)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email tidak valid" });
    }

    // Validasi file identitas
    if (!fileUrl) {
      return res
        .status(400)
        .json({ message: "Bukti identitas tidak boleh kosong" });
    }

    try {
      // Cek apakah email sudah digunakan
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({
          message: "Email sudah digunakan, silahkan gunakan Email yang lain",
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Simpan data pengguna baru
      const newUser = new User({
        fullName,
        email,
        gender,
        birthDate,
        isValidated: "validated", //sementara
        fileIdentity: fileUrl, // Menggunakan URL dari Cloudinary
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({
        message: "Berhasil Registrasi",
        data: {
          fullName: newUser.fullName,
          email: newUser.email,
          gender: newUser.gender,
          fileIdentity: newUser.fileIdentity,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Gagal Registrasi", error: error.message });
    }
  },

  login: async (req, res) => {
    const data = req.body;

    //check if the user exist in db
    const user = await User.findOne({ email: data.email }).exec();
    if (!user)
      return res.json({
        message: "Gagal login, apakah kamu sudah registrasi ?",
      });

    //CheckAccount
    if (user.isValidated !== "validated") {
      return res
        .status(403)
        .json({ message: "Akun anda belum tervalidasi identitasnya" });
    }

    //if user exist -> compare pass w/ bcrypt
    const checkPassword = await bcrypt.compare(data.password, user.password);
    if (!checkPassword) return res.status(401).json({ message: "Gagal login" });
    //token
    try {
      const token = jwt.sign(
        { userId: user._id, fullName: user.fullName, email: user.email }, //payload
        process.env.JWT_KEY //secretkey
      );

      res.cookie("tokenUser", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // secure: false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        // Partitioned: true,
        // { expiresIn: "1h" }
      });

      res.status(201).json({
        message: "Berhasil login",
        // token,
      });
    } catch (error) {
      res.status(400).json({ message: "Gagal Login" });
    }
  },

  logout: (req, res) => {
    res.clearCookie("tokenUser", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.status(201).json({ message: "berhasil Logout" });
  },
};
