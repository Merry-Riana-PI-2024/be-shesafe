require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  adminMiddleware: (req, res, next) => {
    const cookie = req.cookies.token;

    if (!cookie) {
      return res.status(401).json({
        message: "Token tidak ditemukan",
      });
    }

    const token = cookie;

    if (!token) {
      return res.status(401).json("invalid token");
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      req.admin = payload;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(400).json({
        message: "invalid token",
      });
    }
  },
};
