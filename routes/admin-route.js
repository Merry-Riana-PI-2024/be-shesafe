const express = require("express");

const {
  regist,
  login,
  getUser,
  logout,
} = require("../controllers/admin-controller");

const route = express.Router();
route.post("/register", regist);
route.post("/login", login);
route.post("/logout", logout);

route.get("/admin/users", getUser);

module.exports = route;
