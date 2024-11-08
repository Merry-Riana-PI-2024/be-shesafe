require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  checkAuth: (req, res) => {
    const token = req.cookies.tokenUser; 
    
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      return res.status(200).json({ isAuthenticated: true, user: decoded });
    } catch (error) {
      return res.status(401).json({ isAuthenticated: false });
    }
  },

  regist: async (req, res) => {
    const { fullName, email, gender, password, birthDate } = req.body;
  
    // Validasi input
    if (!fullName) return res.status(400).json({ message: "fullname tidak boleh kosong" });
    if (!email) return res.status(400).json({ message: "email tidak boleh kosong" });
    if (!gender) return res.status(400).json({ message: "gender tidak boleh kosong" });
    if (!password) return res.status(400).json({ message: "password tidak boleh kosong" });
    if (!birthDate) return res.status(400).json({ message: "tanggal lahir tidak boleh kosong" });
    if (!req.file) return res.status(400).json({ message: "Bukti Identitas tidak boleh kosong" });
  
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(400).json({
          message: "Email sudah digunakan, silahkan gunakan Email yang lain",
        });
      }
  
      const newUser = new User({
        fullName,
        email,
        gender,
        birthDate,
        fileIdentity: req.file.path,
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
      return res.status(400).json({ message: "Gagal Registrasi", error: error.message });
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
        .status(404)
        .json({ message: "Akun anda belum tervalidasi identitasnya" });
    }

    //if user exist -> compare pass w/ bcrypt
    const checkPassword = await bcrypt.compare(data.password, user.password);
    if (!checkPassword) return res.json({ message: "Gagal login" });

    //token
    try {
      const token = jwt.sign(
        { userId: user._id, fullName: user.fullName, email: user.email }, //payload
        process.env.JWT_KEY //secretkey
      );

      res.cookie("tokenUser", token, {
        httpOnly: true,
        secure: false,
        sameSite: true,
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
    res.clearCookie("tokenUser");
    res.status(201).json({ message: "berhasil Logout" });
  },
};
