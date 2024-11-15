const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/auth");


router.get("/",validateToken, (req, res) => {
  if (req.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.user,
    });
  }
  return res.status(200).json({
    isAuthenticated: false,
    message: "User is not authenticated. Please log in to continue.",
  });
});

module.exports = router;
