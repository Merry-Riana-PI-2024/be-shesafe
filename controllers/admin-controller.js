require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Admin");

module.exports = {
  getUser: async (req, res) => {
    const data = await User.find({});

    res.json({
      message: "berhasil mendapatkan data semua user",
      data,
    });
  },

  regist: async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validasi field
    if (!fullName) {
      return res.status(400).json({ message: "Fullname tidak boleh kosong" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email tidak boleh kosong" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password tidak boleh kosong" });
    }

    try {
      // Hash password hanya setelah semua field tervalidasi
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Cek apakah email sudah digunakan
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({
          message: "Email sudah digunakan, silahkan gunakan Email yang lain",
        });
      }

      // Simpan user baru
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword, // Use hashed password
      });
      await newUser.save();

      return res.status(201).json({
        message: "Berhasil Registrasi",
        data: {
          fullName: newUser.fullName,
          email: newUser.email,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: "Gagal Registrasi", error: error.message });
    }
  },

  login: async (req, res) => {
    const data = req.body;
    const user = await User.findOne({ email: data.email });

    // Check email
    if (!user) {
      return res.status(404).json({ message: "Email tidak terdaftar" });
    }

    // Check password
    const checkPassword = await bcrypt.compare(data.password, user.password);
    if (!checkPassword) {
      return res.json({ message: "User Gagal Login" });
    }

    try {
      const token = jwt.sign(
        { adminId: user._id, fullName: user.fullName, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: true,
        })
        .status(201)
        .json({ message: "User Berhasil Login" });
    } catch (error) {
      res.status(400).json({ message: "Gagal Login" });
    }
  },
  logout: (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
      message: "Berhasil logout",
    });
  },
};
